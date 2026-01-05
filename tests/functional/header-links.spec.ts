import { test } from '@playwright/test';
import { HeaderPage } from '../../pages/header.page';

test.describe('@functional Header - Links and navigation', () => {
  test('Header: main navigation links are present', async ({ page }) => {
    const header = new HeaderPage(page);

    await header.open('/');
    await header.expectHeaderVisible();

  });
});
