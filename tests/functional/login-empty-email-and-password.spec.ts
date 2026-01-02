import { test } from '@playwright/test';
import { HeaderPage } from '../../pages/header.page';
import { AuthPage } from '../../pages/auth.page';

test.describe('@functional Auth - Login Empty Email and Password', () => {
  test('Login (negative): empty email and password shows validation message', async ({ page }) => {
    const header = new HeaderPage(page);
    const auth = new AuthPage(page);

    await header.open('/');

    await header.openLogin();

    await auth.expectLoginFormVisible();

    await auth.submit();

    await auth.expectValidationVisible();
  });
});
