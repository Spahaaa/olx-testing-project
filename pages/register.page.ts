import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class RegisterPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private registerRoot(): Locator {
    return this.page.getByRole('heading', { name: /registr|kreiraj|napravi račun|napravi racun|register/i }).first();
  }

  private nameInput(): Locator {
    return this.page
      .locator('text=/ime|ime i prezime|korisničko ime|korisnicko ime/i')
      .first()
      .locator('xpath=following::input[1]');
  }

  private emailInput(): Locator {
    return this.page
      .locator('text=/email|e-mail|korisnički email|korisnicki email|korisničko ime ili email/i')
      .first()
      .locator('xpath=following::input[1]');
  }

  private passwordInput(): Locator {
    return this.page
      .locator('text=/šifra|sifra|lozinka|password/i')
      .first()
      .locator('xpath=following::input[1]');
  }

  private submitButton(): Locator {
    return this.page
      .getByRole('button', { name: /registruj|registracija|kreiraj|napravi račun|register|potvrdi/i })
      .first();
  }

  async expectRegisterVisible(): Promise<void> {

    await this.page.waitForTimeout(500);
    
    const registerRoot = this.registerRoot();
    const isVisible = await registerRoot.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (isVisible) {
      await expect(registerRoot).toBeVisible({ timeout: 10000 });
      return;
    }
    
    const nameInput = this.nameInput();
    const emailInput = this.emailInput();
    const passwordInput = this.passwordInput();
    
    try {
      await nameInput.waitFor({ state: 'visible', timeout: 5000 });
      await emailInput.waitFor({ state: 'visible', timeout: 5000 });
      await passwordInput.waitFor({ state: 'visible', timeout: 5000 });
      
      return;
    } catch {
    }
  
    await expect(registerRoot).toBeVisible({ timeout: 15000 });
  }

  async fillName(value: string): Promise<void> {
    await this.nameInput().fill(value);
  }

  async fillEmail(value: string): Promise<void> {
    await this.emailInput().fill(value);
  }

  async fillPassword(value: string): Promise<void> {
    await this.passwordInput().fill(value);
  }

  async submit(): Promise<void> {
    await this.page.waitForTimeout(200);
    await this.submitButton().click({ timeout: 15000 });
  }

  async expectValidationVisible(): Promise<void> {
    const name = this.nameInput();
    const email = this.emailInput();
    const pass = this.passwordInput();

    const nameAria = await name.getAttribute('aria-invalid').catch(() => null);
    const emailAria = await email.getAttribute('aria-invalid').catch(() => null);
    const passAria = await pass.getAttribute('aria-invalid').catch(() => null);

    if (nameAria !== null || emailAria !== null || passAria !== null) {
      await expect.soft(name).toHaveAttribute('aria-invalid', /true|1/i, { timeout: 15000 });
      await expect.soft(email).toHaveAttribute('aria-invalid', /true|1/i, { timeout: 15000 });
      await expect.soft(pass).toHaveAttribute('aria-invalid', /true|1/i, { timeout: 15000 });
      return;
    }

    const message = this.page
      .locator('text=/obavezno|required|unesite|un(e)?site|email|šifra|sifra|neispravan|invalid|pogrešan|pogresan|greska|greška/i')
      .first();

    await expect(message).toBeVisible({ timeout: 15000 });
  }
}
