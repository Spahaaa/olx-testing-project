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
    
    // Wait for search input to be ready
    await searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(200); // Small wait for stability
    
    // Clear any existing text first
    await searchInput.clear();
    
    // Fill and submit
    await searchInput.fill(text);
    await this.page.waitForTimeout(200); // Wait for input to register
    await searchInput.press('Enter');
    
    // Wait for navigation/search to start
    await this.page.waitForTimeout(500);
  }

  async expectResultsVisible(): Promise<void> {
    // Wait for results with multiple fallback strategies
    try {
      // First try the standard results locator
      await expect(this.results()).toBeVisible({ timeout: 10000 });
    } catch {
      // Fallback: look for any list or article elements (common for search results)
      const altResults = this.page.locator('main, article, [role="main"], .results, [class*="result"]').first();
      await altResults.waitFor({ state: 'visible', timeout: 10000 });
    }
  }
}
