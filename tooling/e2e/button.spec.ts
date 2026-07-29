import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/components/button/');
});

test('Vue 与 React 示例保持一致的语义和交互', async ({ page }) => {
  const vueDemo = page.locator('[data-demo-framework="vue"]');
  const reactDemo = page.locator('[data-demo-framework="react"]');

  await expect(vueDemo).toHaveAttribute('data-hydrated', 'true');
  await expect(reactDemo).toHaveAttribute('data-hydrated', 'true');
  await vueDemo.getByRole('button', { name: '编织 0' }).click();
  await reactDemo.getByRole('button', { name: '编织 0' }).click();

  await expect(vueDemo.getByRole('button', { name: '编织 1' })).toBeVisible();
  await expect(reactDemo.getByRole('button', { name: '编织 1' })).toBeVisible();
});

test('按钮视觉契约与键盘焦点保持稳定', async ({ page }) => {
  const primaryButton = page
    .locator('[data-demo-framework="vue"]')
    .getByRole('button', { name: '编织 0' });

  await primaryButton.focus();

  // inline-flex 元素作为 flex item 时，其 computed display 会按规范块化为 flex。
  await expect(primaryButton).toHaveCSS('display', 'flex');
  await expect(primaryButton).toHaveCSS('align-items', 'center');
  await expect(primaryButton).toHaveCSS('border-radius', '4px');
  await expect(primaryButton).toHaveCSS('cursor', 'pointer');
  await expect(primaryButton).toBeFocused();
});

test('组件示例没有自动检测到的无障碍违规', async ({ page }) => {
  const accessibilityResults = await new AxeBuilder({ page })
    .include('[data-testid="button-gallery"]')
    .analyze();

  expect(accessibilityResults.violations).toEqual([]);
});
