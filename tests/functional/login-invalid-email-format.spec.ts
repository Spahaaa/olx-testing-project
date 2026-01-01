import { test } from '@playwright/test';
import { HeaderPage } from '../../pages/header.page';
import { AuthPage } from '../../pages/auth.page';

test.describe('@functional Auth - Login Invalid Email Format', () => {
  test('Login (negative): invalid email format shows validation message', async ({ page }) => {
    const header = new HeaderPage(page);
    const auth = new AuthPage(page);

    await header.open('/');
    await header.expectHeaderVisible();

    await header.openLogin();
    await auth.expectLoginFormVisible();

    await auth.fillEmail('not-an-email');
    await auth.fillPassword('SomePassword123!');
    await auth.submit();

    await auth.expectValidationVisible();
  });
});