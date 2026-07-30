---
title: 兼容性、ESM 与 SSR
description: PolyLoom 对 Node.js、浏览器、Vite、Webpack、Nuxt 和现代 SSR 的支持边界。
---

# 兼容性、ESM 与 SSR

## 支持矩阵

| 环境              | 支持范围                                    |
| ----------------- | ------------------------------------------- |
| 包格式            | ESM + TypeScript 声明                       |
| Node.js           | 开发与 SSR `>=22.12`，推荐 24 LTS           |
| Vue               | `>=3.5 <4`                                  |
| React / React DOM | `>=18.3 <20`                                |
| 构建工具          | Vite、Webpack 5 及理解 `exports` 的现代工具 |
| 浏览器            | 当前稳定版 Chromium、Firefox、WebKit        |
| 不支持            | CJS、UMD、IE、Vue 2、Webpack 4              |

## SSR 原则

所有公开入口都可在没有 `window`、`document` 和 `localStorage` 的环境中导入。浏览器 API
只在生命周期或函数调用阶段访问。组件 SSR 输出稳定的语义外壳，浏览器再完成增强。

## Nuxt

Button 可直接在服务端渲染。EmbedPdfVue 会在 SSR 输出带 `aria-busy` 的占位外壳，并在
挂载后动态加载 PDF 运行时；通常不需要 `<ClientOnly>`。如果 PDF URL 本身只能在浏览器
生成，例如依赖 Blob URL，再由页面层使用 `<ClientOnly>` 管理该数据来源。

## Vite

推荐用资源查询让 Vite 托管 PDFium WASM：

```ts
import wasmUrl from '@embedpdf/pdfium/pdfium.wasm?url';
```

## Webpack 5

使用 `new URL(..., import.meta.url)` 或项目既有的 asset/resource 规则输出 WASM，并把最终
公开 URL 传给 `wasmUrl`。确保没有 Babel 插件把 ESM 提前转换成 CommonJS。

## 常见 SSR 误区

- 不要在模块顶层读取主题偏好或生成 Blob URL；
- 不要把服务器文件路径作为浏览器 `src`；
- 不要深层导入第三方查看器内部实现；
- SSR 构建若错误地 external 所有工作区包，应允许打包器解析 ESM 与 Vue SFC。

遇到具体错误请查阅 [FAQ 与故障排查](/guides/faq/)。
