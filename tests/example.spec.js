// Legacy example test (kept for reference). Tests have been migrated to TypeScript.
import { test } from '@playwright/test';

test.describe.skip('legacy example (migrated to TS)', () => {
  test('skipped legacy test', async ({ page }) => {
    // intentionally skipped
  });
});
