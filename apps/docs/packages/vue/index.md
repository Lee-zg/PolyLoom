---
title: '@polyloom/vue'
description: PolyLoom Vue 3 组件、全局安装器、子路径和 peer dependencies。
---

# `@polyloom/vue`

Vue 3 组件模块，提供根入口具名导出、`PolyLoomVue` 全局安装器和单组件子路径。

## 安装

```bash
pnpm add @polyloom/vue vue
```

使用 PDFium 自托管 WASM 时再直接安装：

```bash
pnpm add @embedpdf/pdfium
```

## 依赖

| 类型            | 依赖                                                            |
| --------------- | --------------------------------------------------------------- |
| dependency      | `@polyloom/core`、`@polyloom/theme`、`@embedpdf/vue-pdf-viewer` |
| peer dependency | `vue >=3.5 <4`                                                  |

不会要求安装 React、React DOM 或 Svelte。

## 公开入口

| 入口                                   | 内容                                                  |
| -------------------------------------- | ----------------------------------------------------- |
| `@polyloom/vue`                        | `Button`、`EmbedPdfVue`、`PolyLoomVue` 与全部公开类型 |
| `@polyloom/vue/button`                 | Button 与类型                                         |
| `@polyloom/vue/button/style.css`       | Button 令牌和样式                                     |
| `@polyloom/vue/embedpdf-vue`           | PDF 工作台与类型                                      |
| `@polyloom/vue/embedpdf-vue/style.css` | PDF 工作台令牌和外壳样式                              |
| `@polyloom/vue/style.css`              | Vue 模块全部稳定样式                                  |

## 全局安装

```ts
import { createApp } from 'vue';
import { PolyLoomVue } from '@polyloom/vue';
import '@polyloom/vue/style.css';

createApp(App).use(PolyLoomVue).mount('#app');
```

组件注册名为 `PlButton` 与 `PlEmbedPdfVue`。页面只用少数组件时优先按需导入，以减少初始
代码和 CSS。

阅读 [Button](/components/button/)与 [EmbedPdfVue](/components/embedpdf-vue/)。
