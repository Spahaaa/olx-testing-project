import { test } from '@playwright/test';
import { HeaderPage } from '../../pages/header.page';
import { SearchPage } from '../../pages/search.page';

test.describe('@smoke Search - Basic search', () => {
  test('Smoke: search field works and shows results', async ({ page }) => {
    const header = new HeaderPage(page);
    const search = new SearchPage(page);

    await header.open('/');
    await header.expectHeaderVisible();

    await search.search('test');
    await search.expectResultsVisible();
  });
});
