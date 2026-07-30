import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const preservedRoutes = [
  '/',
  '/components/button/',
  '/components/embedpdf-vue/',
  '/plugins/event-bus/',
  '/guides/getting-started/',
  '/guides/governance/',
  '/guides/imports/',
  '/guides/releasing/',
];

test('保留全部公开 URL 并为未知路径返回定制 404', async ({ page }) => {
  for (const route of preservedRoutes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
  }

  const response = await page.goto('/this-thread-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.getByText('页面未找到')).toBeVisible();
  await expect(page.getByText('这根线没有接入织网。')).toBeVisible();
});

test('导航、侧栏、面包屑、主题、代码复制和移动菜单可用', async ({ page }) => {
  await page.addInitScript(() => {
    // 浏览器引擎对无头模式剪贴板权限支持不一致；固定成功分支以验证 VitePress 复制交互。
    Object.defineProperty(Navigator.prototype, 'clipboard', {
      configurable: true,
      get: () => ({
        writeText: async (text: string) => {
          Reflect.set(window, '__polyloomCopiedText', text);
        },
      }),
    });
  });
  await page.goto('/guides/quick-start/');

  await expect(
    page.getByRole('navigation', { name: 'Main Navigation' }).getByRole('link', {
      name: '指南',
      exact: true,
    }),
  ).toBeVisible();
  const breadcrumbs = page.getByRole('navigation', { name: '面包屑' });
  await expect(breadcrumbs).toContainText('五分钟快速开始');
  await expect(breadcrumbs.getByRole('link', { name: '指南' })).toHaveAttribute(
    'href',
    '/guides/getting-started/',
  );
  await expect(page.locator('.VPSidebar')).toContainText('导入策略');

  const themeSwitch = page.getByRole('switch', { name: '切换深浅主题' });
  await themeSwitch.click();
  await expect(page.locator('html')).toHaveClass(/dark/);

  const codeBlock = page.locator('.vp-code-group div[class*="language-"]').first();
  await codeBlock.hover();
  const copyButton = codeBlock.getByRole('button', { name: /Copy Code|复制代码/ });
  await copyButton.click();
  await expect
    .poll(() => page.evaluate(() => Reflect.get(window, '__polyloomCopiedText')))
    .toContain('pnpm add');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.VPNavBarHamburger').click();
  await expect(page.locator('.VPNavScreen')).toBeVisible();
  await expect(page.locator('.VPNavScreen').getByRole('link', { name: '组件' })).toBeVisible();
});

test('本地中文搜索可定位按需引入、事件总线与 PDF', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '搜索文档' }).click();
  const searchInput = page.getByPlaceholder('搜索');

  const expectations = [
    ['按需引入', /导入策略/],
    ['事件总线', /EventBus 事件总线/],
    ['PDF', /EmbedPdfVue PDF 工作台/],
  ] as const;

  for (const [query, expectedTitle] of expectations) {
    await searchInput.fill(query);
    await expect(page.locator('.VPLocalSearchBox .results')).toContainText(expectedTitle);
  }
});

test('生成 canonical、站点地图、robots、标题和静态正文', async ({ page, request }) => {
  const response = await page.goto('/guides/getting-started/');
  const staticHtml = await response?.text();

  await expect(page).toHaveTitle('项目介绍与设计原则 · PolyLoom');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /目标、包边界/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://lee-zg.github.io/PolyLoom/guides/getting-started/',
  );
  expect(staticHtml).toContain('公开边界可枚举');

  const sitemapResponse = await request.get('/sitemap.xml');
  expect(sitemapResponse.status()).toBe(200);
  expect(await sitemapResponse.text()).toContain(
    'https://lee-zg.github.io/PolyLoom/components/embedpdf-vue/',
  );

  const robotsResponse = await request.get('/robots.txt');
  expect(robotsResponse.status()).toBe(200);
  expect(await robotsResponse.text()).toContain('https://lee-zg.github.io/PolyLoom/sitemap.xml');
});

test('首页、指南、组件页与移动端没有严重或关键 axe 违规', async ({ page }) => {
  const scenarios = [
    { route: '/', viewport: { height: 900, width: 1280 } },
    { route: '/guides/imports/', viewport: { height: 900, width: 1280 } },
    { route: '/components/button/', viewport: { height: 900, width: 1280 } },
    { route: '/', viewport: { height: 844, width: 390 } },
  ];

  for (const { route, viewport } of scenarios) {
    await page.setViewportSize(viewport);
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    const seriousViolations = results.violations.filter(
      ({ impact }) => impact === 'critical' || impact === 'serious',
    );

    expect(seriousViolations, route).toEqual([]);
  }
});
