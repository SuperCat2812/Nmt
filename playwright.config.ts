import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',

  // Пока запускаем E2E последовательно.
  // Для такого приложения это намного стабильнее.
  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: 1,

  reporter: [['list'], ['html', { open: 'never' }]],

  timeout: 30_000,

  expect: {
    timeout: 10_000,
  },

  use: {
    baseURL: 'http://localhost:3000',

    trace: 'retain-on-failure',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',

    navigationTimeout: 30_000,

    actionTimeout: 10_000,
  },

  projects: [
    {
      name: 'chromium',

      use: {
        ...devices['Desktop Chrome'],
      },
    },

    {
      name: 'mobile',

      use: {
        ...devices['Pixel 7'],
      },
    },
  ],

  webServer: {
    command: 'npm run dev',

    url: 'http://localhost:3000',

    reuseExistingServer: true,

    timeout: 120_000,
  },
});
