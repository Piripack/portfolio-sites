import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'pnpm run dev --host 0.0.0.0 --port 4321',
    port: 4321,
    reuseExistingServer: !process.env.CI
  },
  testDir: './tests',
  use: {
    baseURL: 'http://127.0.0.1:4321/portfolio-sites/',
    trace: 'on-first-retry'
  }
});
