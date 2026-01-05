import { test, expect } from '@playwright/test';
import { HeaderPage } from '../../pages/header.page';

test.describe('@smoke Navigation - Basic smoke tests', () => {
  test('Smoke: page navigation works', async ({ page }) => {
    const header = new HeaderPage(page);

    await header.open('/');
    await header.expectHeaderVisible();
    
    const url = page.url();
    expect(url).toContain('olx.ba');
  });

  test('Smoke: header is present on page', async ({ page }) => {
    const header = new HeaderPage(page);

    await header.open('/');
    await header.expectHeaderVisible();
    
    const banner = page.getByRole('banner').first();
    await banner.waitFor({ state: 'visible', timeout: 10000 });
  });
});

