import { test } from '@playwright/test';
import { HeaderPage } from '../../pages/header.page';
import { CreateAdPage } from '../../pages/create-ad.page';

test.describe('@functional CreateAd - Open and validate', () => {
  test('Create ad entry: opens create-ad page (or login redirect)', async ({ page }) => {
    const header = new HeaderPage(page);
    const create = new CreateAdPage(page);

    await header.open('/');
    await header.expectHeaderVisible();

    await header.open('/objavi');
    await create.expectCreateAdVisible();
  });
});
