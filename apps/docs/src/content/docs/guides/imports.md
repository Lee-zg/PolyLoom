---
title: 导入策略
description: 模块入口、子路径、样式与 Tree Shaking 约定。
---

每个公开入口都在包的 `exports` 中显式声明。不要从 `src`、`dist` 或未记录的内部路径导入。

| 目的            | JavaScript                    | 样式                                   |
| --------------- | ----------------------------- | -------------------------------------- |
| Vue 全模块      | `@polyloom/vue`               | `@polyloom/vue/style.css`              |
| Vue Button      | `@polyloom/vue/button`        | `@polyloom/vue/button/style.css`       |
| Vue EmbedPdfVue | `@polyloom/vue/embedpdf-vue`  | `@polyloom/vue/embedpdf-vue/style.css` |
| React 全模块    | `@polyloom/react`             | `@polyloom/react/style.css`            |
| React Button    | `@polyloom/react/button`      | `@polyloom/react/button/style.css`     |
| EventBus        | `@polyloom/plugins/event-bus` | 无                                     |
| 整库            | `polyloom`                    | `polyloom/style.css`                   |

JavaScript 入口不会隐式导入 CSS，因此 SSR、样式顺序和按需加载完全由消费方控制。
EmbedPDF 官方 Web Component 会在自己的内部作用域注入查看器样式，属于第三方运行时例外。
