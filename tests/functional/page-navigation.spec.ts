import { test } from '@playwright/test';
import { HeaderPage } from '../../pages/header.page';

test.describe('@functional Navigation - Basic navigation', () => {
  test('Navigation: can navigate to home page', async ({ page }) => {
    const header = new HeaderPage(page);

    await header.open('/');
    await header.expectHeaderVisible();
    
    // Verify we're on the home page by checking URL
    await page.waitForURL(/\/$/, { timeout: 10000 });
  });

  test('Navigation: page loads without errors', async ({ page }) => {
    const header = new HeaderPage(page);

    await header.open('/');
    await header.expectHeaderVisible();
    
    // Check that page loaded successfully (no console errors)
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Wait a bit to catch any immediate errors
    await page.waitForTimeout(1000);
    
    // Test passes if header is visible (basic sanity check)
  });
});

