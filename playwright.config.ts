import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30 * 1000,
  retries: 1,
  use: {
    headless: true,
    baseURL: 'http://localhost:8001',
    viewport: { width: 375, height: 812 },
  },
});
