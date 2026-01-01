import { test } from '@playwright/test';
import { HeaderPage } from '../../pages/header.page';
import { AuthPage } from '../../pages/auth.page';

test.describe('@functional Auth - Login Empty Password', () => {
  test('Login (negative): empty password shows validation message', async ({ page }) => {
    const header = new HeaderPage(page);
    const auth = new AuthPage(page);

    await header.open('/');
    await header.expectHeaderVisible();

    await header.openLogin();
    await auth.expectLoginFormVisible();

   
    await auth.fillEmail('test@test.com');
    await auth.submit();

    await auth.expectValidationVisible();
  });
});