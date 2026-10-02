import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { testConfig } from './config/testConfig';
import { envConfig } from './config/envConfig';

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['steps/**/*.ts', 'fixtures/testFixture.ts'],
});

export default defineConfig({
  testDir,
  timeout: testConfig.timeout,
  expect: {
    timeout: testConfig.expectTimeout,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: testConfig.retries,
  workers: testConfig.workers,
  outputDir: 'test-results',
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'reports/playwright-html' }]],
  use: {
    baseURL: envConfig.baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
