import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class SearchPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private searchInput(): Locator {
    return this.page.getByRole('searchbox').first();
  }

  private results(): Locator {
    return this.page.getByRole('list').first();
  }

  async search(text: string): Promise<void> {
    await this.searchInput().fill(text);
    await this.searchInput().press('Enter');
  }

  async expectResultsVisible(): Promise<void> {
    await expect(this.results()).toBeVisible({ timeout: 15000 });
  }
}
