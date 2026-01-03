import { test } from '@playwright/test';
import { HeaderPage } from '../../pages/header.page';

test.describe('@smoke Header - Basic header presence', () => {
  test('Smoke: header elements are visible', async ({ page }) => {
    const header = new HeaderPage(page);

    await header.open('/');
    await header.expectHeaderVisible();
  });
});
