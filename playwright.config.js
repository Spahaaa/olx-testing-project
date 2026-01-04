// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  /* Directory where tests are located */
  testDir: './tests',

  /* OLX.ba is sensitive → do NOT run fully parallel */
  fullyParallel: false,

  /* Fail CI build if test.only is left */
  forbidOnly: !!process.env.CI,

  /* Retry failed tests on CI */
  retries: process.env.CI ? 2 : 0,

  /* Run tests sequentially to avoid bot detection */
  workers: 1,

  /* Reporters:
     - list → terminal output
     - html → execution evidence (screenshots, traces)
  */
  reporter: [['list'], ['html']],

  /* Shared settings for all projects */
  use: {
    /* Base URL for OLX */
    baseURL: 'https://olx.ba',

    /* Collect trace on first retry */
    trace: 'on-first-retry',

    /* Take screenshots only on failure */
    screenshot: 'only-on-failure',

    /* Record video only on failure */
    video: 'retain-on-failure',

    /* Increase navigation timeout for slow page loads */
    navigationTimeout: 30000,

    /* Wait for network to be idle before considering page loaded */
    actionTimeout: 20000,
  },

  /* Global timeout for each test */
  timeout: 60000,

  /* Expect timeout for assertions */
  expect: {
    timeout: 15000,
  },

  /* Browsers configuration */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});