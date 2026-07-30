---
title: 主题、CSS Layer 与设计令牌
description: 导入 PolyLoom 样式，切换明暗主题，并安全覆盖 CSS 变量和组件样式。
---

# 主题、CSS Layer 与设计令牌

## 样式入口

```ts
// 只加载令牌
import '@polyloom/theme/tokens.css';

// 单个组件
import '@polyloom/vue/button/style.css';

// Vue 模块全部样式
import '@polyloom/vue/style.css';

// 六包聚合样式
import 'polyloom/style.css';
```

单组件样式已经包含令牌和组件 CSS，通常不必再重复导入 `tokens.css`。

## CSS Layer

设计令牌位于 `polyloom.tokens`，组件样式位于 `polyloom.components`。PolyLoom 不注入
reset，也不会修改 `body`、标题或表单控件的全局默认值。

应用可以声明自己的层顺序：

```css
@layer reset, polyloom.tokens, polyloom.components, application;

@layer application {
  .checkout-action {
    --pl-color-primary: #173f35;
  }
}
```

## 设计令牌

| 变量                    | 用途           |
| ----------------------- | -------------- |
| `--pl-color-background` | 页面背景       |
| `--pl-color-surface`    | 控件与容器表面 |
| `--pl-color-foreground` | 主要文本       |
| `--pl-color-muted`      | 次要文本       |
| `--pl-color-border`     | 边界线         |
| `--pl-color-accent`     | 状态与装饰强调 |
| `--pl-color-focus`      | 键盘焦点环     |
| `--pl-radius-control`   | 控件圆角       |
| `--pl-duration-fast`    | 短交互时长     |

## 明暗主题

默认使用浅色令牌。把 `data-pl-theme="dark"` 放在文档根节点或局部容器即可启用深色主题：

```html
<html data-pl-theme="dark">
  <!-- 应用 -->
</html>
```

PolyLoom 不自动跟随系统主题，避免 SSR 首屏和水合结果不一致。应用可在客户端读取
`prefers-color-scheme`，再显式设置属性。

## 覆盖规则

优先覆盖公开 `--pl-*` 变量。确需修改结构样式时，用应用自己的 CSS Layer 和额外类名，
不要依赖组件内部 DOM 层级。EmbedPDF Web Component 的内部样式由第三方运行时管理，
不属于 PolyLoom 主题 API。

## 动效与可访问性

组件在 `prefers-reduced-motion: reduce` 时停止非必要动画。覆盖 `--pl-duration-fast` 时仍应
保持焦点、loading 与状态变化可感知，不应只靠颜色表达状态。
