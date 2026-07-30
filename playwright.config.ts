import { defineConfig, devices } from '@playwright/test';

const browserName = process.env.PLAYWRIGHT_BROWSER ?? 'chromium';
const browserProjects = {
  chromium: {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  firefox: {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
  webkit: {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  },
} as const;

export default defineConfig({
  expect: {
    timeout: 5_000,
  },
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: true,
  globalSetup: './tooling/e2e/global-setup.mjs',
  projects:
    browserName === 'all'
      ? [browserProjects.chromium, browserProjects.firefox, browserProjects.webkit]
      : [browserProjects[browserName as keyof typeof browserProjects] ?? browserProjects.chromium],
  reporter: process.env.CI ? [['html', { open: 'never' }], ['github']] : 'list',
  retries: process.env.CI ? 2 : 0,
  testDir: './tooling/e2e',
  // PDFium 初始化与 axe 扫描都会占用较多 CPU；固定并发可避免元素稳定性判断被资源争用拖垮。
  workers: 2,
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'on-first-retry',
  },
});
