# PolyLoom

> 把散落在历史项目里的前端代码，编织成可独立消费、可持续演进的模块。

[![持续集成](https://github.com/Lee-zg/PolyLoom/actions/workflows/ci.yml/badge.svg)](https://github.com/Lee-zg/PolyLoom/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/polyloom.svg)](https://www.npmjs.com/package/polyloom)
[![文档](https://img.shields.io/badge/docs-GitHub%20Pages-c77816)](https://lee-zg.github.io/PolyLoom/)
[![MIT](https://img.shields.io/badge/license-MIT-1b1a17)](./LICENSE)

PolyLoom 是一个面向个人长期维护的多框架前端库。Vue、React、框架无关逻辑、主题和
JavaScript 插件分别发布，同时通过聚合包提供完整目录视图。公开 API 使用标准
`exports` 子路径；无需把每个小组件维护成独立 npm 包，也能按需引入和 Tree Shaking。

首版提供 Vue/React Button、类型安全 EventBus，以及从历史项目重构而来的
`EmbedPdfVue` PDF 工作台。

## 文档

- [中文项目介绍](https://lee-zg.github.io/PolyLoom/guides/getting-started/)
- [五分钟快速开始](https://lee-zg.github.io/PolyLoom/guides/quick-start/)
- [导入矩阵](https://lee-zg.github.io/PolyLoom/guides/imports/)
- [包总览](https://lee-zg.github.io/PolyLoom/packages/overview/)
- [English overview](https://lee-zg.github.io/PolyLoom/en/)

## 导入边界

```ts
// 整库：适合组件目录或同时运行多个框架的项目
import { Core, Plugins, React, Theme, Vue } from 'polyloom';

// 框架模块
import { Button } from '@polyloom/vue';

// 单组件
import { Button } from '@polyloom/vue/button';
import '@polyloom/vue/button/style.css';

import { EmbedPdfVue } from '@polyloom/vue/embedpdf-vue';
import '@polyloom/vue/embedpdf-vue/style.css';

// 单插件
import { createEventBus } from '@polyloom/plugins/event-bus';
```

| 包                  | 用途                         |
| ------------------- | ---------------------------- |
| `@polyloom/core`    | 框架无关类型与纯逻辑         |
| `@polyloom/theme`   | CSS 变量、主题与组件样式     |
| `@polyloom/plugins` | 无框架依赖的 JavaScript 插件 |
| `@polyloom/vue`     | Vue 3 组件与安装器           |
| `@polyloom/react`   | React 组件                   |
| `polyloom`          | 全部模块的聚合入口           |

普通应用优先安装需要的模块包；`polyloom` 聚合包同时声明 Vue、React 与 React DOM
peer dependencies，更适合组件目录或多框架工具。

## EmbedPdfVue

```vue
<script setup lang="ts">
import wasmUrl from '@embedpdf/pdfium/pdfium.wasm?url';
import { EmbedPdfVue } from '@polyloom/vue/embedpdf-vue';
import '@polyloom/vue/embedpdf-vue/style.css';
</script>

<template>
  <EmbedPdfVue src="/documents/guide.pdf" :wasm-url="wasmUrl" :initial-page="2" title="使用指南" />
</template>
```

运行时只在浏览器挂载后异步加载，入口可安全用于 SSR；`previewType="iframe"` 可切换为
浏览器原生预览。完整 API、WASM/CSP/CORS 和 Nuxt 说明见
[在线文档](https://lee-zg.github.io/PolyLoom/components/embedpdf-vue/)。

## 本地开发

需要 Node.js 24 LTS 和 pnpm 11.9。

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:pack
pnpm docs:build
pnpm test:e2e
pnpm docs:dev
```

新增内容必须先从实验入口开始：

```bash
pnpm generate component vue status-chip
pnpm generate component react status-chip
pnpm generate plugin clipboard
```

完整准入流程见 [CONTRIBUTING.md](./CONTRIBUTING.md)，发布与 Trusted Publishing
切换步骤见 [PUBLISHING.md](./PUBLISHING.md)。

## English

PolyLoom is a personal, multi-framework frontend library for curating reusable UI components and
JavaScript plugins. Framework and domain packages publish explicit subpath exports, so consumers
can install one module or import one component without maintaining a package for every small unit.

Version 0.1.0 includes equivalent Vue 3 and React Button components, shared design tokens, a typed
EventBus, and the SSR-safe `EmbedPdfVue` workbench with a native iframe fallback.

[Overview](https://lee-zg.github.io/PolyLoom/en/) ·
[Quick Start](https://lee-zg.github.io/PolyLoom/en/quick-start/) ·
[Import Matrix](https://lee-zg.github.io/PolyLoom/en/imports/)

## License

[MIT](./LICENSE). EmbedPDF and PDFium attribution is preserved in
[THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).
