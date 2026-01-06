import { test, expect } from '@playwright/test';
import { HeaderPage } from '../../pages/header.page';
import { SearchPage } from '../../pages/search.page';

test.describe('@functional Search - Basic functionality', () => {
  test('Search: search input is accessible', async ({ page }) => {
    const header = new HeaderPage(page);
    const search = new SearchPage(page);

    await header.open('/');
    await header.expectHeaderVisible();

    const searchInput = page.getByRole('searchbox').first();
    await searchInput.waitFor({ state: 'visible', timeout: 10000 });
  });

  test('Search: can type in search field', async ({ page }) => {
    const header = new HeaderPage(page);
    const search = new SearchPage(page);

    await header.open('/');
    await header.expectHeaderVisible();

    const searchInput = page.getByRole('searchbox').first();
    await searchInput.waitFor({ state: 'visible', timeout: 10000 });
    
    await searchInput.click();
    await page.waitForTimeout(200);
    
    await searchInput.clear();
    await page.waitForTimeout(100);
    
    await searchInput.fill('test query');
    await page.waitForTimeout(300);
    
    const value = await searchInput.inputValue();
    expect(value).toBe('test query');
  });
});

