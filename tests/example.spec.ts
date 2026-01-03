import { test } from '@playwright/test';
import { HomePage } from '../pages/home.page';

test('example: home banner is visible', async ({ page }) => {
  const home = new HomePage(page);

  await home.open('https://playwright.dev/');
  await home.expectHomeVisible();
});
