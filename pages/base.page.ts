import { Page, expect } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(path: string = '/') {
    await this.page.goto(path);

    // Detect Cloudflare / anti-bot interstitials which show messages like
    // "Verify you are human" or "needs to review the security of your connection".
    // If present, wait briefly for it to auto-resolve, otherwise throw a clear error
    // so the failure explains the root cause instead of producing misleading UI errors.
    const cfChallenge = this.page.locator(
      'text=/verify you are human|needs to review the security of your connection|ray id:/i'
    ).first();

    if (await cfChallenge.isVisible().catch(() => false)) {
      // give it some time to disappear automatically (e.g., 15s), then fail if still present
      try {
        await expect(cfChallenge).toBeHidden({ timeout: 15000 });
        return;
      } catch (e) {
        throw new Error(
          'Navigation blocked by Cloudflare anti-bot interstitial. Tests cannot continue.\n' +
            'Cause: Cloudflare is showing a human verification page.\n' +
            'Mitigation: run tests from a less restrictive network, use a validated session (storageState), or configure a proxy that bypasses the challenge.'
        );
      }
    }
  }
  async expectUrlContains(value: string | RegExp) {
    if (typeof value === 'string') {
      await expect(this.page).toHaveURL(new RegExp(value));
    } else {
      await expect(this.page).toHaveURL(value);
    }
  }
}