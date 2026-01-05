import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class CreateAdPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private root(): Locator {
    return this.page.getByRole('heading', { name: /post|objavi|kreiraj|napravi|dodaj/i }).first();
  }

  async expectCreateAdVisible(): Promise<void> {

    const createRoot = this.root();

    if (await createRoot.isVisible().catch(() => false)) {
      await expect(createRoot).toBeVisible({ timeout: 15000 });
      return;
    }

    const loginEmail = this.page
      .locator('text=/korisničko ime ili email|korisnicko ime ili email|email/i')
      .first()
      .locator('xpath=following::input[1]');

    if (await loginEmail.isVisible().catch(() => false)) {
      return;
    }

    const privacyDialog = this.page.locator('text=/poštujemo vašu privatnost|privacy/i').first();
    if (await privacyDialog.isVisible().catch(() => false)) {
      throw new Error(
        'Navigation to create-ad blocked by privacy/consent dialog ("Poštujemo vašu privatnost"). ' +
          'Mitigation: accept cookies manually in a browser and use `storageState`, or add a network/proxy that bypasses the consent.'
      );
    }

    const notFound = this.page.locator('text=/oprostite, ne možemo pronaći ovu stranicu|sorry, we cannot find this page|not found/i').first();
    if (await notFound.isVisible().catch(() => false)) {
      const createAdButton = this.page
        .getByRole('link', { name: /objavi|post|kreiraj|napravi|dodaj oglas|create ad/i })
        .or(this.page.getByRole('button', { name: /objavi|post|kreiraj|napravi|dodaj oglas|create ad/i }))
        .first();
      
      if (await createAdButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await Promise.all([
          this.page.waitForURL(/\/objavi|\/post|\/create|\/new/i, { timeout: 15000 }).catch(() => {}),
          createAdButton.click({ timeout: 15000 })
        ]);
        
        await this.page.waitForTimeout(1000);
        
        if (await createRoot.isVisible().catch(() => false)) {
          await expect(createRoot).toBeVisible({ timeout: 15000 });
          return;
        }
        
        if (await loginEmail.isVisible().catch(() => false)) {
          return;
        }
      }
      
      throw new Error(
        'Received a 404 page when opening the create-ad entry. This may indicate a site change or bot/blocking behavior; verify the path and site availability.'
      );
    }

    await expect(createRoot).toBeVisible({ timeout: 15000 });
  }

  private titleInput(): Locator {
    return this.page
      .locator('text=/naslov|title|naslov oglasa/i')
      .first()
      .locator('xpath=following::input[1]');
  }

  private priceInput(): Locator {
    return this.page
      .locator('text=/cijena|cena|price/i')
      .first()
      .locator('xpath=following::input[1]');
  }

  private descriptionInput(): Locator {
    return this.page
      .locator('textarea')
      .first();
  }

  private submitButton(): Locator {
    return this.page
      .getByRole('button', { name: /objavi|post|publish|potvrdi|nastavi/i })
      .first();
  }

  async fillTitle(value: string): Promise<void> {
    await this.titleInput().fill(value);
  }

  async fillPrice(value: string): Promise<void> {
    await this.priceInput().fill(value);
  }

  async fillDescription(value: string): Promise<void> {
    await this.descriptionInput().fill(value);
  }

  async submitAd(): Promise<void> {
    await this.submitButton().click({ timeout: 15000 });
  }

  async expectValidationVisible(): Promise<void> {
    const title = this.titleInput();
    const price = this.priceInput();

    const titleAria = await title.getAttribute('aria-invalid').catch(() => null);
    const priceAria = await price.getAttribute('aria-invalid').catch(() => null);

    if (titleAria !== null || priceAria !== null) {
      await expect.soft(title).toHaveAttribute('aria-invalid', /true|1/i, { timeout: 15000 });
      await expect.soft(price).toHaveAttribute('aria-invalid', /true|1/i, { timeout: 15000 });
      return;
    }

    const message = this.page
      .locator('text=/obavezno|required|unesite|cijena|naslov|polje|greska|greška/i')
      .first();

    await expect(message).toBeVisible({ timeout: 15000 });
  }
}
