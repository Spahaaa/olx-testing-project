import { test, expect } from '@playwright/test';
import { HeaderPage } from '../../pages/header.page';

test.describe('@smoke Auth - Open Register', () => {
  test('Smoke: Registration entry opens', async ({ page }) => {
    const header = new HeaderPage(page);

    await header.open('/');
    await header.expectHeaderVisible();

    await header.openRegister();

    await expect(
      page.locator('text=/registracija|kreiraj|napravi račun|napravi racun|register/i').first(),
    ).toBeVisible();
  });
});