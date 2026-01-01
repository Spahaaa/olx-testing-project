import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class HeaderPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Basic "header is loaded" anchor (logo/search/whatever exists in header)
 private headerRoot(): Locator {
  // OLX header (role=banner) je stabilan i treba biti jedinstven
  return this.page.getByRole('banner').first();
}


  private loginTrigger(): Locator {
    return this.page
      .getByRole('link', { name: /prijava|login/i })
      .or(this.page.getByRole('button', { name: /prijava|login/i }))
      .first();
  }

  private registerTrigger(): Locator {
    return this.page
      .getByRole('link', { name: /registr|register/i })
      .or(this.page.getByRole('button', { name: /registr|register/i }))
      .first();
  }

  // Navigate using baseURL from config
  async open(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }

  async expectHeaderVisible(): Promise<void> {
    await expect(this.headerRoot()).toBeVisible({ timeout: 15000 });
  }

  // FIX: OLX cookie banner (Quantcast) blocks clicks
  async acceptCookiesIfPresent(): Promise<void> {
    const frame = this.page.frameLocator(
      'iframe[id^="qc-cmp2-ui"], iframe[src*="quantcast"]'
    );

    const iframeAccept = frame
      .getByRole('button', { name: /prihvat|accept|slažem|slazem|agree|ok/i })
      .first();

    if (await iframeAccept.isVisible().catch(() => false)) {
      await iframeAccept.click();
      return;
    }

    const pageAccept = this.page
      .getByRole('button', { name: /prihvat|accept|slažem|slazem|agree|ok/i })
      .first();

    if (await pageAccept.isVisible().catch(() => false)) {
      await pageAccept.click();
      return;
    }

    const closeBtn = this.page
      .locator(
        '#qc-cmp2-container button[aria-label*="close" i], #qc-cmp2-container button[title*="close" i]'
      )
      .first();

    if (await closeBtn.isVisible().catch(() => false)) {
      await closeBtn.click();
    }
  }

  async openLogin(): Promise<void> {
    await this.acceptCookiesIfPresent();
    await this.loginTrigger().click({ timeout: 15000 });
  }

  async openRegister(): Promise<void> {
    await this.acceptCookiesIfPresent();
    await this.registerTrigger().click({ timeout: 15000 });
  }
}
