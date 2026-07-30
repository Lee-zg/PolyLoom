---
title: '@polyloom/theme'
description: PolyLoom CSS 令牌、组件样式和完整主题入口。
---

# `@polyloom/theme`

框架无关的 CSS 令牌与组件样式，以及可在设计工具和 CSS-in-JS 中读取的令牌名称元数据。

## 安装

```bash
pnpm add @polyloom/theme
```

## 公开入口

| 入口                               | 内容                      |
| ---------------------------------- | ------------------------- |
| `@polyloom/theme`                  | `tokenNames`、`TokenName` |
| `@polyloom/theme/tokens.css`       | 只含明暗主题变量          |
| `@polyloom/theme/button.css`       | 只含 Button 结构样式      |
| `@polyloom/theme/embedpdf-vue.css` | 只含 PDF 工作台外壳       |
| `@polyloom/theme/style.css`        | 令牌与全部稳定组件样式    |

```ts
import { tokenNames } from '@polyloom/theme';
import '@polyloom/theme/tokens.css';

console.log(tokenNames.focus); // --pl-color-focus
```

## 依赖与副作用

没有运行时或 peer dependencies。JavaScript 无副作用；CSS 被明确列在 `sideEffects`，防止
打包器错误删除显式样式导入。

完整覆盖规则见[主题、CSS Layer 与设计令牌](/guides/theme/)。
