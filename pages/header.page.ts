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

  private createAdTrigger(): Locator {
    return this.page
      .getByRole('link', { name: /objavi|post|kreiraj|napravi|dodaj oglas|create ad/i })
      .or(this.page.getByRole('button', { name: /objavi|post|kreiraj|napravi|dodaj oglas|create ad/i }))
      .first();
  }

  // Navigate using baseURL from config
  async open(path: string = '/'): Promise<void> {
    // Use BasePage.open to keep Cloudflare detection and other global checks
    await super.open(path);

    // Ensure cookie/privacy dialogs are dismissed after navigation so they don't block interactions
    await this.acceptCookiesIfPresent();
    
    // Wait for page to be stable before proceeding
    await this.waitForPageStable();
  }

  // Wait for page to be stable - header visible and no major layout shifts
  private async waitForPageStable(): Promise<void> {
    try {
      // Wait for header to be visible (indicates page is loaded)
      await this.headerRoot().waitFor({ state: 'visible', timeout: 10000 });
      // Wait a bit more for any dynamic content
      await this.page.waitForTimeout(300);
    } catch (e) {
      // Continue even if timeout - might still work
    }
  }

  async expectHeaderVisible(): Promise<void> {
    await expect(this.headerRoot()).toBeVisible({ timeout: 15000 });
  }

  // FIX: OLX cookie banner (Quantcast) blocks clicks
  async acceptCookiesIfPresent(): Promise<void> {
    // Wait a bit for cookie banner to appear
    await this.page.waitForTimeout(500);

    // First, try to find and click cookie consent in iframe (most common)
    try {
      const frame = this.page.frameLocator(
        'iframe[id^="qc-cmp2-ui"], iframe[src*="quantcast"], iframe[title*="cookie" i]'
      );

      const iframeAccept = frame
        .getByRole('button', { name: /^(prihvat|accept|slažem se|slazem se|agree|ok|u redu)$/i })
        .first();

      if (await iframeAccept.isVisible({ timeout: 3000 }).catch(() => false)) {
        await iframeAccept.click({ timeout: 5000 });
        await this.page.waitForTimeout(500); // Wait for banner to disappear
        return;
      }
    } catch (e) {
      // Continue to next method
    }

    // Try to find accept button directly on page (more specific selectors)
    try {
      // Look for buttons with specific IDs or classes related to cookie consent
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
      // Continue to next method
    }

    // Try close button (X) for cookie banner
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
      // Continue
    }

    // Final fallback: remove cookie/privacy dialogs from DOM if they're blocking
    try {
      await this.page.evaluate(() => {
        // Remove Quantcast cookie banner
        const qcContainer = document.getElementById('qc-cmp2-container');
        if (qcContainer) {
          qcContainer.remove();
        }
        
        // Remove any iframes related to cookie consent
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
      // Continue anyway
    }
  }

  async openLogin(): Promise<void> {
    await this.acceptCookiesIfPresent();
    
    // Wait for login trigger to be ready
    const loginLink = this.loginTrigger();
    await loginLink.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(200); // Small wait for stability
    
    // Click and wait for navigation or form
    await Promise.all([
      this.page.waitForURL(/\/login/, { timeout: 15000 }).catch(() => {
        // If URL doesn't change, wait for login form to appear instead
        return this.page.waitForSelector('input[type="email"], input[name*="email" i], input[placeholder*="email" i], input[type="text"][name*="email" i]', { timeout: 15000 }).catch(() => {});
      }),
      loginLink.click({ timeout: 15000 })
    ]);
    
    // Wait for page to stabilize after navigation
    await this.page.waitForTimeout(500);
    await this.acceptCookiesIfPresent(); // Accept cookies again if they appeared
  }

  async openRegister(): Promise<void> {
    await this.acceptCookiesIfPresent();
    
    // Wait for register trigger to be ready
    const registerLink = this.registerTrigger();
    await registerLink.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(200); // Small wait for stability
    
    // Click and wait for navigation or form
    await Promise.all([
      this.page.waitForURL(/\/registr|register|signup|sign-up/i, { timeout: 15000 }).catch(() => {
        // If URL doesn't change, wait for register form to appear instead
        return this.page.waitForSelector('input[type="text"], input[name*="name" i], input[placeholder*="ime" i]', { timeout: 15000 }).catch(() => {});
      }),
      registerLink.click({ timeout: 15000 })
    ]);
    
    // Wait for page to stabilize after navigation
    await this.page.waitForTimeout(500);
    await this.acceptCookiesIfPresent(); // Accept cookies again if they appeared
  }

  async openCreateAd(): Promise<void> {
    await this.acceptCookiesIfPresent();
    // Try to click create ad button/link if available
    const createAdTrigger = this.createAdTrigger();
    if (await createAdTrigger.isVisible({ timeout: 5000 }).catch(() => false)) {
      await Promise.all([
        this.page.waitForURL(/\/objavi|\/post|\/create|\/new/i, { timeout: 15000 }).catch(() => {}),
        createAdTrigger.click({ timeout: 15000 })
      ]);
      // Wait a bit for page to load
      await this.page.waitForTimeout(1000);
      return;
    }
    // Fallback: navigate directly to /objavi
    await this.open('/objavi');
  }
}
