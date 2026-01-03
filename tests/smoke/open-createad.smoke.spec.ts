import { test } from '@playwright/test';
import { HeaderPage } from '../../pages/header.page';
import { CreateAdPage } from '../../pages/create-ad.page';

test.describe('@smoke CreateAd - Open create ad', () => {
  test('Smoke: create ad entry opens', async ({ page }) => {
    const header = new HeaderPage(page);
    const create = new CreateAdPage(page);

    await header.open('/');
    await header.expectHeaderVisible();

    // Try to open create-ad (may redirect to login)
    await header.open('/objavi');
    await create.expectCreateAdVisible();
  });
});
