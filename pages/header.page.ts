import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class HeaderPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

 private headerRoot(): Locator {
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

  private createAdTrigger(): Locator {
    return this.page
      .getByRole('link', { name: /objavi|post|kreiraj|napravi|dodaj oglas|create ad/i })
      .or(this.page.getByRole('button', { name: /objavi|post|kreiraj|napravi|dodaj oglas|create ad/i }))
      .first();
  }

  async open(path: string = '/'): Promise<void> {
    await super.open(path);

    await this.acceptCookiesIfPresent();
    
    await this.waitForPageStable();
  }

  private async waitForPageStable(): Promise<void> {
    try {
      await this.headerRoot().waitFor({ state: 'visible', timeout: 10000 });

      await this.page.waitForTimeout(300);
    } catch (e) {
    }
  }

  async expectHeaderVisible(): Promise<void> {
    await expect(this.headerRoot()).toBeVisible({ timeout: 15000 });
  }

  async acceptCookiesIfPresent(): Promise<void> {
    await this.page.waitForTimeout(500);

    try {
      const frame = this.page.frameLocator(
        'iframe[id^="qc-cmp2-ui"], iframe[src*="quantcast"], iframe[title*="cookie" i]'
      );

      const iframeAccept = frame
        .getByRole('button', { name: /^(prihvat|accept|slažem se|slazem se|agree|ok|u redu)$/i })
        .first();

      if (await iframeAccept.isVisible({ timeout: 3000 }).catch(() => false)) {
        await iframeAccept.click({ timeout: 5000 });
        await this.page.waitForTimeout(500); 
        return;
      }
    } catch (e) {

    }

    try {
      const cookieButtons = [
        '#qc-cmp2-ui button[class*="accept"]',
        '#qc-cmp2-ui button[class*="agree"]',
        '[id*="cookie"] button[class*="accept"]',
        '[id*="consent"] button[class*="accept"]',
        'button[aria-label*="prihvat" i]',
        'button[aria-label*="accept" i]',
      ];

      for (const selector of cookieButtons) {
        const btn = this.page.locator(selector).first();
        if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await btn.click({ timeout: 5000 });
          await this.page.waitForTimeout(500);
          return;
        }
      }
    } catch (e) {

    }

    try {
      const closeBtn = this.page
        .locator(
          '#qc-cmp2-container button[aria-label*="close" i], #qc-cmp2-container button[title*="close" i], button.qc-cmp2-close-icon'
        )
        .first();

      if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await closeBtn.click({ timeout: 5000 });
        await this.page.waitForTimeout(500);
        return;
      }
    } catch (e) {

    }

    try {
      await this.page.evaluate(() => {

        const qcContainer = document.getElementById('qc-cmp2-container');
        if (qcContainer) {
          qcContainer.remove();
        }
        
        const iframes = document.querySelectorAll('iframe[id*="qc"], iframe[src*="quantcast"], iframe[title*="cookie" i]');
        iframes.forEach(iframe => {
          const container = iframe.closest('[id*="qc"], [class*="cookie"], [class*="consent"]');
          if (container) {
            container.remove();
          }
        });
      });
      await this.page.waitForTimeout(300);
    } catch (e) {

    }
  }

  async openLogin(): Promise<void> {
    await this.acceptCookiesIfPresent();
    
    const loginLink = this.loginTrigger();
    await loginLink.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(200); 
    
    await Promise.all([
      this.page.waitForURL(/\/login/, { timeout: 15000 }).catch(() => {

        return this.page.waitForSelector('input[type="email"], input[name*="email" i], input[placeholder*="email" i], input[type="text"][name*="email" i]', { timeout: 15000 }).catch(() => {});
      }),
      loginLink.click({ timeout: 15000 })
    ]);
    
    await this.page.waitForTimeout(500);
    await this.acceptCookiesIfPresent(); 
  }

  async openRegister(): Promise<void> {
    await this.acceptCookiesIfPresent();
    
    const registerLink = this.registerTrigger();
    await registerLink.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(200); 
    
    await Promise.all([
      this.page.waitForURL(/\/registr|register|signup|sign-up/i, { timeout: 15000 }).catch(() => {

        return this.page.waitForSelector('input[type="text"], input[name*="name" i], input[placeholder*="ime" i]', { timeout: 15000 }).catch(() => {});
      }),
      registerLink.click({ timeout: 15000 })
    ]);
    
    await this.page.waitForTimeout(500);
    await this.acceptCookiesIfPresent(); 
  }

  async openCreateAd(): Promise<void> {
    await this.acceptCookiesIfPresent();
    const createAdTrigger = this.createAdTrigger();
    if (await createAdTrigger.isVisible({ timeout: 5000 }).catch(() => false)) {
      await Promise.all([
        this.page.waitForURL(/\/objavi|\/post|\/create|\/new/i, { timeout: 15000 }).catch(() => {}),
        createAdTrigger.click({ timeout: 15000 })
      ]);
      await this.page.waitForTimeout(1000);
      return;
    }
    await this.open('/objavi');
  }
}
