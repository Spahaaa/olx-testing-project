import { test } from '@playwright/test';
import { HeaderPage } from '../../pages/header.page';
import { HomePage } from '../../pages/home.page';

test.describe('@functional Home - Page Load', () => {
  test('Home page: loads successfully and displays header', async ({ page }) => {
    const header = new HeaderPage(page);
    const home = new HomePage(page);

    await header.open('/');
    await header.expectHeaderVisible();
    await home.expectHomeVisible();
  });
});

