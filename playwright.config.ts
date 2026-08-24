import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/environment';

/**
 * Full framework config.
 * Levels are separated into folders (tests/beginner, tests/intermediate, tests/advanced)
 * so you can run them independently as you progress: npm run test:beginner, etc.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,

  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ...(process.env.CI ? [['github'] as const] : []),
  ],

  use: {
    baseURL: env.baseURL,
    headless: env.headless,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    locale: env.locale,
    timezoneId: 'America/New_York',
    // Real sites like booking.com often show cookie/consent banners and
    // geo-adaptive layouts; a stable viewport keeps locators predictable.
    viewport: { width: 1440, height: 900 },
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
    //{ name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    //{ name: 'webkit', use: { ...devices['Desktop Safari'] } },
    //{ name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
  ],
});
