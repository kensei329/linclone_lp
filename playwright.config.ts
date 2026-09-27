import { defineConfig, devices } from '@playwright/test';

// STUB (WP0a), owned by WP7: minimal config against a production build.
export default defineConfig({
  testDir: 'tests',
  use: { baseURL: process.env.BASE_URL ?? 'http://localhost:3200' },
  webServer: process.env.BASE_URL
    ? undefined
    : { command: 'npx next start -p 3200', url: 'http://localhost:3200', reuseExistingServer: true },
  projects: [
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
});
