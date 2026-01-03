import { test } from '@playwright/test';
import { HeaderPage } from '../../pages/header.page';
import { RegisterPage } from '../../pages/register.page';

test.describe('@functional Register - Invalid email', () => {
  test('Register (negative): invalid email shows validation', async ({ page }) => {
    const header = new HeaderPage(page);
    const register = new RegisterPage(page);

    await header.open('/');
    await header.openRegister();

    await register.expectRegisterVisible();
    await register.fillName('Test User');
    await register.fillPassword('SomePassword123!');
    await register.fillEmail('not-an-email');

    await register.submit();

    await register.expectValidationVisible();
  });
});
