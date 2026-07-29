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
  // PDFium 初始化对 CPU/内存较敏感；限制 CI 并发可避免“元素持续不稳定”的资源争用假失败。
  workers: process.env.CI ? 2 : undefined,
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'on-first-retry',
  },
});
