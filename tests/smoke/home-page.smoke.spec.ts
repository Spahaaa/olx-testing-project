import { test } from '@playwright/test';
import { HeaderPage } from '../../pages/header.page';
import { HomePage } from '../../pages/home.page';

test.describe('@smoke Home - Basic page load', () => {
  test('Smoke: home page loads and displays correctly', async ({ page }) => {
    const header = new HeaderPage(page);
    const home = new HomePage(page);

    await header.open('/');
    await header.expectHeaderVisible();
    await home.expectHomeVisible();
  });
});

