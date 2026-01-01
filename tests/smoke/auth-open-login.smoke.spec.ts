import { test } from '@playwright/test';
import { HeaderPage } from '../../pages/header.page';
import { AuthPage } from '../../pages/auth.page';

test.describe('@smoke Auth - Open Login', () => {
  test('Smoke: Login form opens', async ({ page }) => {
    const header = new HeaderPage(page);
    const auth = new AuthPage(page);

    await header.open('/');
    await header.expectHeaderVisible();

    await header.openLogin();
    await auth.expectLoginFormVisible();
  });
});