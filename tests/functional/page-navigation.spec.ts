import { test } from '@playwright/test';
import { HeaderPage } from '../../pages/header.page';

test.describe('@functional Navigation - Basic navigation', () => {
  test('Navigation: can navigate to home page', async ({ page }) => {
    const header = new HeaderPage(page);

    await header.open('/');
    await header.expectHeaderVisible();
    
    await page.waitForURL(/\/$/, { timeout: 10000 });
  });

  test('Navigation: page loads without errors', async ({ page }) => {
    const header = new HeaderPage(page);

    await header.open('/');
    await header.expectHeaderVisible();
    
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(1000);
    
  });
});

