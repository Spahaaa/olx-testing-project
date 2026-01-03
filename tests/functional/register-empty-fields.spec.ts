import { test } from '@playwright/test';
import { HeaderPage } from '../../pages/header.page';
import { RegisterPage } from '../../pages/register.page';

test.describe('@functional Register - Empty fields', () => {
  test('Register (negative): empty required fields show validation', async ({ page }) => {
    const header = new HeaderPage(page);
    const register = new RegisterPage(page);

    await header.open('/');
    await header.openRegister();

    await register.expectRegisterVisible();
    // Submit with empty fields
    await register.submit();

    await register.expectValidationVisible();
  });
});
