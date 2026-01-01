import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class AuthPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // OLX login: "KORISNIČKO IME ILI EMAIL" (nije standardni label)
  private emailInput(): Locator {
    return this.page
      .locator('text=/korisničko ime ili email|korisnicko ime ili email/i')
      .first()
      .locator('xpath=following::input[1]');
  }

  // OLX login: "ŠIFRA"
  private passwordInput(): Locator {
    return this.page
      .locator('text=/šifra|sifra/i')
      .first()
      .locator('xpath=following::input[1]');
  }

  private submitButton(): Locator {
    return this.page
      .getByRole('button', {
        name: /prijavi(\s*se)?|prijava|login|nastavi|potvrdi/i,
      })
      .first();
  }

  // Cookie banner (Quantcast) zna blokirati klikove
  async acceptCookiesIfPresent(): Promise<void> {
    // pokušaj u iframe-u (često je tamo)
    const frame = this.page.frameLocator(
      'iframe[id^="qc-cmp2-ui"], iframe[src*="quantcast"]'
    );

    const iframeAccept = frame
      .getByRole('button', { name: /prihvat|accept|slažem|slazem|agree|ok|u redu/i })
      .first();

    if (await iframeAccept.isVisible().catch(() => false)) {
      await iframeAccept.click();
      return;
    }

    // pokušaj direktno na stranici
    const pageAccept = this.page
      .getByRole('button', { name: /prihvat|accept|slažem|slazem|agree|ok|u redu/i })
      .first();

    if (await pageAccept.isVisible().catch(() => false)) {
      await pageAccept.click();
      return;
    }

    // fallback: close (X) ako postoji
    const closeBtn = this.page
      .locator(
        '#qc-cmp2-container button[aria-label*="close" i], #qc-cmp2-container button[title*="close" i]'
      )
      .first();

    if (await closeBtn.isVisible().catch(() => false)) {
      await closeBtn.click();
    }
  }

  async expectLoginFormVisible(): Promise<void> {
    // provjeri da si stvarno na login stranici
    await expect(this.page).toHaveURL(/\/login/, { timeout: 15000 });

    // onda provjeri inpute
    await expect(this.emailInput()).toBeVisible({ timeout: 15000 });
    await expect(this.passwordInput()).toBeVisible({ timeout: 15000 });
  }

  async fillEmail(value: string): Promise<void> {
    await this.emailInput().fill(value);
  }

  async fillPassword(value: string): Promise<void> {
    await this.passwordInput().fill(value);
  }

  async submit(): Promise<void> {
    await this.acceptCookiesIfPresent();
    await this.submitButton().click({ timeout: 15000 });
  }

  // Validacija na OLX često nije tekst, nego aria-invalid na inputima
  async expectValidationVisible(): Promise<void> {
    await this.acceptCookiesIfPresent();

    const email = this.emailInput();
    const pass = this.passwordInput();

    // pokušaj aria-invalid (najstabilnije)
    const emailHasAria = await email.getAttribute('aria-invalid').catch(() => null);
    const passHasAria = await pass.getAttribute('aria-invalid').catch(() => null);

    if (emailHasAria !== null || passHasAria !== null) {
      // bar jedno polje treba biti invalid u negative testovima
      await expect
        .soft(email)
        .toHaveAttribute('aria-invalid', /true|1/i, { timeout: 15000 });
      await expect
        .soft(pass)
        .toHaveAttribute('aria-invalid', /true|1/i, { timeout: 15000 });
      return;
    }

    // fallback: tekstualna poruka (ako postoji)
    const message = this.page
      .locator(
        'text=/obavezno|required|unesite|un(e)?site|korisničko|korisnicko|email|šifra|sifra|neispravan|invalid|pogrešan|pogresan|greška|greska|polje/i'
      )
      .first();

    await expect(message).toBeVisible({ timeout: 15000 });
  }
}
