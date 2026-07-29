import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/components/embedpdf-vue/');
});

test('真实 PDF 与本地 WASM 完成加载并跳转到第二页', async ({ page }) => {
  const demo = page.locator('[data-demo-framework="vue"]');
  const viewer = demo.getByTestId('embedpdf-vue-demo');

  await expect(demo).toHaveAttribute('data-hydrated', 'true');
  await expect(demo.locator('output')).toHaveText('两页文档已加载', { timeout: 30_000 });
  await expect(viewer).toHaveAttribute('aria-busy', 'false');
  await expect(viewer.locator('embedpdf-container')).toBeAttached();

  // 官方页码输入框位于开放的 Web Component shadow root，使用语义名称避免受隐藏文件输入顺序影响。
  await expect(viewer.getByRole('textbox', { name: '当前页码' })).toHaveValue('2');
});

test('键盘焦点、响应式外壳与 iframe 回退均可用', async ({ page }) => {
  const demo = page.locator('[data-demo-framework="vue"]');
  const viewer = demo.getByTestId('embedpdf-vue-demo');

  await expect(demo.locator('output')).toHaveText('两页文档已加载', { timeout: 30_000 });
  const externalLink = viewer.getByRole('link', { name: /新窗口打开/ });
  await externalLink.focus();
  await expect(externalLink).toBeFocused();

  await page.setViewportSize({ width: 520, height: 900 });
  const viewerBox = await viewer.boundingBox();
  expect(viewerBox?.width).toBeLessThanOrEqual(488);

  await demo.getByRole('button', { name: 'iframe 回退' }).click();
  await expect(viewer.locator('iframe')).toBeVisible();
  await expect(demo.locator('output')).toHaveText('两页文档已加载');
});

test('文档错误可恢复且组件外壳无自动检测到的无障碍违规', async ({ page }) => {
  const demo = page.locator('[data-demo-framework="vue"]');
  const viewer = demo.getByTestId('embedpdf-vue-demo');

  await expect(demo.locator('output')).toHaveText('两页文档已加载', { timeout: 30_000 });
  await demo.getByRole('button', { name: '错误演练' }).click();
  await expect(viewer.getByRole('alert')).toContainText('无法显示这份文档', {
    timeout: 30_000,
  });

  await demo.getByRole('button', { name: '恢复示例' }).click();
  await expect(demo.locator('output')).toHaveText('两页文档已加载', { timeout: 30_000 });

  const accessibilityResults = await new AxeBuilder({ page })
    .include('[data-testid="embedpdf-vue-demo"]')
    .analyze();
  expect(accessibilityResults.violations).toEqual([]);
});
