import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60 * 1000,
  retries: 1,
  use: {
    headless: true,
    baseURL: 'http://localhost:8001',
    viewport: { width: 375, height: 812 },
  },
  webServer: {
    command: 'npx expo start --web --port 8001',
    url: 'http://localhost:8001',
    reuseExistingServer: !process.env.CI,
    timeout: 180 * 1000,
  },
});
