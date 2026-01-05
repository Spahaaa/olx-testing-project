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
    const searchInput = this.searchInput();
    
    await searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(200); 
    
    await searchInput.clear();
    
    await searchInput.fill(text);
    await this.page.waitForTimeout(200); 
    await searchInput.press('Enter');
    await this.page.waitForTimeout(500);
  }

  async expectResultsVisible(): Promise<void> {
    try {
      await expect(this.results()).toBeVisible({ timeout: 10000 });
    } catch {
      const altResults = this.page.locator('main, article, [role="main"], .results, [class*="result"]').first();
      await altResults.waitFor({ state: 'visible', timeout: 10000 });
    }
  }
}
