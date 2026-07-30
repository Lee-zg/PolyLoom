---
title: FAQ 与故障排查
description: 处理安装、样式、子路径、SSR、PDF、WASM、CSP 与跨域问题。
---

# FAQ 与故障排查

## 为什么找不到 `@polyloom/vue/button`

确认安装的是 `@polyloom/vue`，构建工具支持 `package.json#exports`，且没有导入
`/src/*`。旧版 Webpack、Jest 或 TypeScript 可能需要升级到现代模块解析模式。

## 组件有结构但没有样式

JavaScript 不会隐式加载 PolyLoom CSS。按需入口需要显式导入：

```ts
import '@polyloom/vue/button/style.css';
```

## 为什么 Vue 项目要求安装 React

正常情况下不会。请安装 `@polyloom/vue` 而不是聚合包 `polyloom`；后者同时聚合 Vue 与
React，因此声明了两个框架的 peer dependencies。

## SSR 报 `window is not defined`

先确认堆栈来自 PolyLoom 公开入口，而非业务模块或第三方深层导入。`EmbedPdfVue` 运行时
只在挂载后加载；不要在服务端手动导入 `@embedpdf/vue-pdf-viewer`。

## PDF 一直停在加载状态

依次检查：

1. PDF URL 是否返回 200，且 CORS 允许当前站点读取；
2. `wasmUrl` 是否返回 `application/wasm`；
3. CSP 是否允许 worker、WASM 和必要的 blob URL；
4. 静态服务器是否正确保留 `.wasm` 与 `.pdf` 文件；
5. 受限环境可先设置 `viewerConfig.worker: false` 定位 Worker 问题。

## iframe 为什么没有报告 404

浏览器对 iframe 内部 HTTP 错误的 `error` 事件并不统一。需要可靠状态时，应在服务端或
受控 API 先验证 URL；组件始终保留安全的新窗口链接作为回退。

## 深色主题没有自动跟随系统

这是有意的：自动读取系统主题会增加 SSR 首屏闪烁与水合差异。由应用决定主题策略，并在
根节点设置 `data-pl-theme="dark"`。

仍未解决时，请提交最小复现、运行环境、实际导入语句和完整错误堆栈到
[GitHub Issues](https://github.com/Lee-zg/PolyLoom/issues)。
