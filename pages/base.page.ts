import { Page, expect } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(path: string = '/') {

    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    
    try {

      await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 });

      await this.page.waitForTimeout(500);
    } catch (e) {

    }

    const cfChallenge = this.page.locator(
      'text=/verify you are human|needs to review the security of your connection|ray id:/i'
    ).first();

    if (await cfChallenge.isVisible().catch(() => false)) {
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

  async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries) {
          await this.page.waitForTimeout(delay);
        }
      }
    }
    
    throw lastError || new Error('Operation failed after retries');
  }
}