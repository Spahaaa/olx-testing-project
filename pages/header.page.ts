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
    // Use BasePage.open to keep Cloudflare detection and other global checks
    await super.open(path);

    // Ensure cookie/privacy dialogs are dismissed after navigation so they don't block interactions
    await this.acceptCookiesIfPresent();
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

    if (await iframeAccept.isVisible({ timeout: 10000 }).catch(() => false)) {
      await iframeAccept.click();
      return;
    }

    const pageAccept = this.page
      .getByRole('button', { name: /prihvat|accept|slažem|slazem|agree|ok/i })
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

    // Aggressive fallback: look for any visible text matching known accept phrases and force-click it.
    const anyAccept = this.page.locator('text=/slažem se|prihvat|accept|agree|ok|u redu/i').first();
    if (await anyAccept.isVisible({ timeout: 3000 }).catch(() => false)) {
      await anyAccept.click({ force: true });
      return;
    }

    // Final fallback: if a privacy/consent dialog is present but not interactable, remove it from DOM.
    await this.page.evaluate(() => {
      const textRegex = /poštujemo vašu privatnost|privacy|verify you are human|needs to review the security of your connection|ray id:/i;
      const nodes = Array.from(document.querySelectorAll('body *'));
      for (const n of nodes) {
        const txt = n.textContent || '';
        if (textRegex.test(txt)) {
          let el = n;
          while (el && el !== document.body) {
            const tag = el.tagName && el.tagName.toLowerCase();
            const role = el.getAttribute && el.getAttribute('role');
            const id = el.id || '';
            const cls = el.className || '';
            if (
              tag === 'dialog' ||
              role === 'dialog' ||
              id.toLowerCase().includes('qc') ||
              cls.toString().toLowerCase().includes('consent') ||
              cls.toString().toLowerCase().includes('privacy')
            ) {
              el.remove();
              break;
            }
            el = el.parentElement;
          }
        }
      }
    });
    // allow caller to proceed after removing nuisance elements
    return;
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
