---
title: Button 按钮
description: Vue 与 React 语义一致、支持 loading、原生属性透传和键盘操作的基础按钮。
---

# Button 按钮

<span class="pl-api-label">Vue 3</span> <span class="pl-api-label">React 18/19</span>
<span class="pl-api-label">SSR safe</span>

用于触发立即操作或提交表单。Vue 与 React 版本共享状态逻辑、视觉令牌和无障碍契约，
同时保留各自的 slot、children、事件与 ref 习惯。

## 安装

::: code-group

```bash [Vue]
pnpm add @polyloom/vue vue
```

```bash [React]
pnpm add @polyloom/react react react-dom
```

:::

## 交互示例

<div class="pl-demo-grid" data-testid="button-gallery">
  <VueButtonDemo />
  <ReactButtonHost />
</div>

## 按需导入

::: code-group

```vue [Vue]
<script setup lang="ts">
import { Button } from '@polyloom/vue/button';
import '@polyloom/vue/button/style.css';
</script>

<template>
  <Button variant="primary">保存</Button>
</template>
```

```tsx [React]
import { Button } from '@polyloom/react/button';
import '@polyloom/react/button/style.css';

export function SaveButton() {
  return <Button variant="primary">保存</Button>;
}
```

:::

## 视觉层级

| `variant`   | 用途               | 建议                   |
| ----------- | ------------------ | ---------------------- |
| `primary`   | 当前区域的主要操作 | 每个操作组通常只放一个 |
| `secondary` | 次级、可逆操作     | 可与 primary 并列      |
| `ghost`     | 低强调或导航式操作 | 避免用于破坏性确认     |

尺寸支持 `sm`、`md`、`lg`。尺寸只改变控件密度，不改变按钮优先级。

## 共有属性

| 属性       | 类型                                  | 默认值      | 说明                   |
| ---------- | ------------------------------------- | ----------- | ---------------------- |
| `variant`  | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | 视觉层级               |
| `size`     | `'sm' \| 'md' \| 'lg'`                | `'md'`      | 控件尺寸               |
| `loading`  | `boolean`                             | `false`     | 显示进度并阻止重复操作 |
| `disabled` | `boolean`                             | `false`     | 禁止用户交互           |

### Vue 专属属性

| 属性   | 类型                              | 默认值     | 说明         |
| ------ | --------------------------------- | ---------- | ------------ |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | 原生按钮类型 |

React 版本直接继承 `ButtonHTMLAttributes<HTMLButtonElement>`，但重定义了 `size` 与
`disabled` 以保持跨框架 API 一致。

## 事件

### Vue

`click(event: MouseEvent)` 在可交互状态下触发。`loading` 与 `disabled` 状态会同时设置原生
`disabled`，并对程序化触发做额外保护。

### React

使用原生 `onClick`、`onFocus`、`onBlur` 等属性；事件对象和冒泡行为不做包装。

## Slot 与 children

- Vue 使用默认 slot；
- React 使用 `children`；
- loading 图标具有 `aria-hidden="true"`，按钮可访问名称仍来自文本内容；
- 不要只放一个没有可访问名称的图标。

## Ref 与原生属性透传

Vue 未声明 attrs 会透传到真实 `<button>`，可使用 `aria-*`、`data-*`、`name`、
`form` 等原生属性。React 使用 `forwardRef<HTMLButtonElement>`，ref 直接指向真实按钮。

```tsx
const buttonRef = useRef<HTMLButtonElement>(null);
<Button ref={buttonRef} aria-describedby="save-help">
  保存
</Button>;
```

## loading、disabled 与表单语义

loading 会设置 `aria-busy="true"` 并令按钮 disabled，防止异步提交重复触发。默认
`type="button"`，避免组件放入表单后意外提交；需要提交时必须显式设置 `type="submit"`。

disabled 按钮不会获得键盘焦点。如果必须解释禁用原因，应把说明放在按钮附近；不要依赖
disabled 元素的 tooltip。

## 样式与主题

单组件 CSS 包含设计令牌与 Button 样式。通过 `--pl-color-primary`、
`--pl-color-focus`、`--pl-radius-control` 等变量覆盖视觉；完整规则见
[主题与样式](/guides/theme/)。

## 无障碍

- 使用原生 `<button>`，Enter 与 Space 键行为由浏览器提供；
- 焦点使用 `:focus-visible`，不要移除焦点环；
- loading 不是进度百分比，只表达“操作正在处理”；
- 主次层级不能只靠颜色，边框与填充也提供差异；
- 自动化测试覆盖键盘焦点、可访问名称与 axe。

## SSR 与性能

Button 不访问浏览器全局，可直接 SSR。状态逻辑来自 `@polyloom/core/button`，单组件入口
不会包含 EmbedPdfVue；样式约为单组件范围，不加载模块全量 CSS。

## 故障排查

- **没有样式**：确认导入对应 `style.css`；
- **表单没有提交**：设置 `type="submit"`；
- **点击没有触发**：检查 `loading`、`disabled` 和父级是否拦截事件；
- **React ref 为空**：确认读取发生在挂载后；
- **类型中没有原生属性**：确认从公开子路径导入且 TypeScript 使用 Bundler/NodeNext 解析。

## 源码与许可证

源码位于
[`packages/vue/src/button`](https://github.com/Lee-zg/PolyLoom/tree/main/packages/vue/src/button)
与
[`packages/react/src/button`](https://github.com/Lee-zg/PolyLoom/tree/main/packages/react/src/button)，
按 [MIT](https://github.com/Lee-zg/PolyLoom/blob/main/LICENSE) 发布。
