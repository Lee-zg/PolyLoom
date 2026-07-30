---
layout: home
title: PolyLoom 多框架前端库
description: 把散落在历史项目里的前端代码，编织成可独立消费、可持续演进的 Vue、React 组件与 JavaScript 插件。
hero:
  name: POLYLOOM / 0.1.0
  text: 把历史代码，织成长期资产
  tagline: Vue、React、框架无关逻辑与插件各归其位，共享一套视觉语言、测试门槛和明确的子路径导出。
  actions:
    - theme: brand
      text: 五分钟开始
      link: /guides/quick-start/
    - theme: alt
      text: 查看 PDF 工作台
      link: /components/embedpdf-vue/
features:
  - icon: '01'
    title: 按发布边界拆包
    details: 六个包分别声明依赖与 peer，Vue 项目无需安装 React，单插件也无需引入 UI。
  - icon: '02'
    title: 子路径即按需入口
    details: 整库、模块、单组件、单插件和单份 CSS 都由标准 exports 明确约束。
  - icon: '03'
    title: 质量门槛统一
    details: 类型、单测、SSR、真实浏览器、无障碍、tarball 消费与发布产物一起验证。
---

<div class="pl-section-kicker">One semantics / native ergonomics</div>

## 同一语义，两种框架原生手感

Button 在 Vue 使用 slot、attrs 与 emit，在 React 使用 children、原生属性和
`forwardRef`。两端共享状态逻辑与设计令牌，但不强迫框架适配层长得一样。

<div class="pl-demo-grid" data-testid="home-button-gallery">
  <VueButtonDemo />
  <ReactButtonHost />
</div>

## 四级消费边界

<div class="pl-import-matrix">
  <strong>整库</strong><code>polyloom</code>
  <strong>模块</strong><code>@polyloom/vue</code>
  <strong>单组件</strong><code>@polyloom/vue/button</code>
  <strong>单插件</strong><code>@polyloom/plugins/event-bus</code>
</div>

::: code-group

```bash [pnpm]
pnpm add @polyloom/vue vue
```

```bash [npm]
npm install @polyloom/vue vue
```

```bash [yarn]
yarn add @polyloom/vue vue
```

:::

## 六个公开包，一张清晰的依赖图

<div class="pl-package-grid">
  <a class="pl-package-card" href="./packages/core/"><strong>@polyloom/core</strong><span>框架无关类型与纯逻辑</span></a>
  <a class="pl-package-card" href="./packages/theme/"><strong>@polyloom/theme</strong><span>CSS Layer、令牌与组件样式</span></a>
  <a class="pl-package-card" href="./packages/plugins/"><strong>@polyloom/plugins</strong><span>无全局单例的 JavaScript 插件</span></a>
  <a class="pl-package-card" href="./packages/vue/"><strong>@polyloom/vue</strong><span>Vue 3 组件与全局安装器</span></a>
  <a class="pl-package-card" href="./packages/react/"><strong>@polyloom/react</strong><span>React 组件与 ref 透传</span></a>
  <a class="pl-package-card" href="./packages/polyloom/"><strong>polyloom</strong><span>多框架目录与整库样式入口</span></a>
</div>

## 首版主角：EmbedPdfVue

`EmbedPdfVue` 是从真实历史项目迁移并完成兼容 API 重构的 Vue 3 PDF 工作台。它在浏览器
挂载后才加载 EmbedPDF 运行时，提供本地 PDFium WASM、自定义配置、页码跳转、错误恢复与
iframe 回退，同时允许 SSR 安全导入。

```ts
import { EmbedPdfVue } from '@polyloom/vue/embedpdf-vue';
import '@polyloom/vue/embedpdf-vue/style.css';
```

[阅读完整 PDF 工作台文档 →](/components/embedpdf-vue/)

## 质量基线

<div class="pl-metric-grid">
  <div class="pl-metric"><strong>6</strong><span>独立 SemVer 公开包</span></div>
  <div class="pl-metric"><strong>4</strong><span>按需消费层级</span></div>
  <div class="pl-metric"><strong>3</strong><span>Playwright 浏览器引擎</span></div>
  <div class="pl-metric"><strong>0</strong><span>文档外部字体与 CDN</span></div>
</div>

从[项目介绍](/guides/getting-started/)理解设计边界，或直接进入
[五分钟快速开始](/guides/quick-start/)。
