import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private hero(): Locator {
    return this.page.getByRole('banner').first();
  }

  async expectHomeVisible(): Promise<void> {
    await expect(this.hero()).toBeVisible({ timeout: 15000 });
  }
}
