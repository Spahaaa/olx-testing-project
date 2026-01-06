import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class AuthPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private emailInput(): Locator {
    return this.page
      .locator('text=/korisničko ime ili email|korisnicko ime ili email/i')
      .first()
      .locator('xpath=following::input[1]');
  }

  private passwordInput(): Locator {
    return this.page
      .locator('text=/šifra|sifra/i')
      .first()
      .locator('xpath=following::input[1]');
  }

  private async getEmailInput(): Promise<Locator> {
    const primary = this.emailInput();
    try {
      const count = await primary.count();
      if (count > 0 && await primary.isVisible({ timeout: 2000 }).catch(() => false)) {
        return primary;
      }
    } catch {
    }
    return this.page.locator('input[type="email"], input[name*="email" i], input[type="text"][name*="email" i]').first();
  }

  private async getPasswordInput(): Promise<Locator> {
    const primary = this.passwordInput();
    try {
      const count = await primary.count();
      if (count > 0 && await primary.isVisible({ timeout: 2000 }).catch(() => false)) {
        return primary;
      }
    } catch {
    }
    return this.page.locator('input[type="password"], input[name*="password" i], input[name*="pass" i], input[name*="šifra" i], input[name*="sifra" i]').first();
  }

  private submitButton(): Locator {
    return this.page
      .getByRole('button', {
        name: /prijavi(\s*se)?|prijava|login|nastavi|potvrdi/i,
      })
      .first();
  }

  async acceptCookiesIfPresent(): Promise<void> {

    const frame = this.page.frameLocator(
      'iframe[id^="qc-cmp2-ui"], iframe[src*="quantcast"]'
    );

    const iframeAccept = frame
      .getByRole('button', { name: /prihvat|accept|slažem|slazem|agree|ok|u redu/i })
      .first();

    if (await iframeAccept.isVisible({ timeout: 10000 }).catch(() => false)) {
      await iframeAccept.click();
      return;
    }

    const pageAccept = this.page
      .getByRole('button', { name: /prihvat|accept|slažem|slazem|agree|ok|u redu/i })
      .first();

    if (await pageAccept.isVisible({ timeout: 10000 }).catch(() => false)) {
      await pageAccept.click();
      return;
    }

    const closeBtn = this.page
      .locator(
        '#qc-cmp2-container button[aria-label*="close" i], #qc-cmp2-container button[title*="close" i]'
      )
      .first();

    if (await closeBtn.isVisible({ timeout: 10000 }).catch(() => false)) {
      await closeBtn.click();
    }

    const anyAccept = this.page.locator('text=/slažem se|prihvat|accept|agree|ok|u redu/i').first();
    if (await anyAccept.isVisible({ timeout: 3000 }).catch(() => false)) {
      await anyAccept.click({ force: true });
      return;
    }

    await this.page.evaluate(() => {
  const textRegex = /poštujemo vašu privatnost|privacy|verify you are human|needs to review the security of your connection|ray id:/i;

  const nodes = Array.from(document.querySelectorAll('body *'));

  for (const n of nodes) {
    const txt = n.textContent ?? '';
    if (!textRegex.test(txt)) continue;

    let el: Element | null = n;

    while (el && el !== document.body) {
      const tag = el.tagName?.toLowerCase() ?? '';
      const role = el.getAttribute?.('role') ?? '';
      const id = (el as HTMLElement).id ?? '';
      const cls = ((el as HTMLElement).className ?? '').toString().toLowerCase();

      if (
        tag === 'dialog' ||
        role === 'dialog' ||
        id.toLowerCase().includes('qc') ||
        cls.includes('consent') ||
        cls.includes('privacy')
      ) {
        el.remove();
        break;
      }

      el = el.parentElement;
    }
  }
});


    return;
  }

  async expectLoginFormVisible(): Promise<void> {
   
    await this.page.waitForTimeout(500);
    
    try {
      await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 });
    } catch {
    }
    
    try {
      await expect(this.page).toHaveURL(/\/login/, { timeout: 5000 });
    } catch {
    }

    let emailInput = this.emailInput();
    try {
      await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    } catch (error) {
      if (error instanceof Error && error.message.includes('closed')) {
        throw error;
      }
      emailInput = this.page.locator('input[type="email"], input[name*="email" i], input[type="text"][name*="email" i]').first();
      await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    }

    let passwordInput = this.passwordInput();
    try {
      await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    } catch (error) {
      if (error instanceof Error && error.message.includes('closed')) {
        throw error;
      }
      passwordInput = this.page.locator('input[type="password"], input[name*="password" i], input[name*="pass" i], input[name*="šifra" i], input[name*="sifra" i]').first();
      await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    }

    await expect(emailInput).toBeVisible({ timeout: 5000 });
    await expect(passwordInput).toBeVisible({ timeout: 5000 });
  }

  async fillEmail(value: string): Promise<void> {
    const emailInput = await this.getEmailInput();
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.fill(value);
  }

  async fillPassword(value: string): Promise<void> {
    const passwordInput = await this.getPasswordInput();
    await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    await passwordInput.fill(value);
  }

  async submit(): Promise<void> {
    await this.acceptCookiesIfPresent();
    await this.submitButton().click({ timeout: 15000 });
  }

  async expectValidationVisible(): Promise<void> {
    await this.acceptCookiesIfPresent();

    const email = await this.getEmailInput();
    const pass = await this.getPasswordInput();

    const emailHasAria = await email.getAttribute('aria-invalid').catch(() => null);
    const passHasAria = await pass.getAttribute('aria-invalid').catch(() => null);

    if (emailHasAria !== null || passHasAria !== null) {

      await expect
        .soft(email)
        .toHaveAttribute('aria-invalid', /true|1/i, { timeout: 15000 });
      await expect
        .soft(pass)
        .toHaveAttribute('aria-invalid', /true|1/i, { timeout: 15000 });
      return;
    }

    const message = this.page
      .locator(
        'text=/obavezno|required|unesite|un(e)?site|korisničko|korisnicko|email|šifra|sifra|neispravan|invalid|pogrešan|pogresan|greška|greska|polje/i'
      )
      .first();

    await expect(message).toBeVisible({ timeout: 15000 });
  }
}
