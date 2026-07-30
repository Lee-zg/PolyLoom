---
title: EmbedPdfVue PDF 工作台
description: SSR 安全、支持 PDFium 自托管、initialPage、错误恢复和 iframe 回退的 Vue 3 PDF 查看组件。
---

# EmbedPdfVue PDF 工作台

<span class="pl-api-label">Vue 3</span> <span class="pl-api-label">EmbedPDF 2.x</span>
<span class="pl-api-label">SSR safe</span>

`EmbedPdfVue` 为 PDF 阅读提供带状态外壳的工作台：默认使用 EmbedPDF/PDFium 渲染，
也可以切换浏览器原生 iframe。组件从历史项目迁移而来，已移除业务样式、Tailwind 与模块
初始化阶段的浏览器依赖。

## 真实交互示例

示例使用仓库自有两页 PDF 与本地打包的 PDFium WASM，不请求第三方 PDF、字体或 CDN。

<EmbedPdfVueDemo />

## 安装

::: code-group

```bash [pnpm]
pnpm add @polyloom/vue @embedpdf/pdfium vue
```

```bash [npm]
npm install @polyloom/vue @embedpdf/pdfium vue
```

```bash [yarn]
yarn add @polyloom/vue @embedpdf/pdfium vue
```

:::

`@embedpdf/vue-pdf-viewer` 是 `@polyloom/vue` 的普通依赖。示例把
`@embedpdf/pdfium` 声明为直接依赖，是为了稳定解析 `pdfium.wasm?url` 子路径。

## 按需导入

```vue
<script setup lang="ts">
import wasmUrl from '@embedpdf/pdfium/pdfium.wasm?url';
import { EmbedPdfVue } from '@polyloom/vue/embedpdf-vue';
import '@polyloom/vue/embedpdf-vue/style.css';
</script>

<template>
  <EmbedPdfVue src="/documents/guide.pdf" :initial-page="2" title="使用指南" :wasm-url="wasmUrl" />
</template>
```

## 配置优先级

组件先展开 `viewerConfig`，再用明确 props 写入关键配置。优先级从高到低为：

1. `src`；
2. `wasmUrl`；
3. `defaultZoom` → `viewerConfig.zoom.defaultZoomLevel`；
4. `viewerConfig` 的其余字段。

因此可以在 `viewerConfig.zoom` 保留 `minZoom`、`maxZoom` 和 `zoomStep`，同时用
`defaultZoom` 单独控制首次缩放。

## 属性

| 属性           | 类型                                        | 默认值        | 说明                         |
| -------------- | ------------------------------------------- | ------------- | ---------------------------- |
| `src`          | `string`                                    | 必填          | PDF URL、相对路径或 Blob URL |
| `title`        | `string`                                    | `'PDF 文档'`  | 空字符串隐藏标题栏           |
| `previewType`  | `'default' \| 'iframe'`                     | `'default'`   | 工作台或浏览器原生预览       |
| `defaultZoom`  | `ZoomLevel`                                 | `'fit-width'` | 首次布局缩放                 |
| `initialPage`  | `number`                                    | `1`           | 布局完成后跳转并限制到有效页 |
| `height`       | `string`                                    | `'80vh'`      | 查看区域 CSS 高度            |
| `wasmUrl`      | `string`                                    | 上游默认      | 自托管 PDFium WASM URL       |
| `viewerConfig` | `Omit<PDFViewerConfig, 'src' \| 'wasmUrl'>` | —             | 其余官方配置                 |

`ZoomLevel` 支持 `'automatic'`、`'fit-page'`、`'fit-width'` 或数值倍率。

## 动态 src 与模式切换

`src`、`previewType`、`defaultZoom`、`initialPage`、`wasmUrl` 或 `viewerConfig` 变化时，
组件会清理旧 registry 订阅并重新装载。Blob URL 的创建与释放仍由消费应用负责：

```ts
const objectUrl = URL.createObjectURL(file);
pdfSource.value = objectUrl;

onBeforeUnmount(() => URL.revokeObjectURL(objectUrl));
```

## initialPage

页码跳转发生在官方 `onLayoutReady` 后。小于 1、非整数或大于总页数的值会被限制到
有效范围；小型文档若在 registry ready 前完成布局，组件通过状态流补偿竞态，避免漏发
`load`。

## 事件

| 事件    | 载荷                               | 时机                        |
| ------- | ---------------------------------- | --------------------------- |
| `init`  | `EmbedPdfContainer`                | 官方 Web Component 容器创建 |
| `ready` | `PluginRegistry`                   | 插件 registry 可用          |
| `load`  | `{ src, documentId?, pageCount? }` | 文档布局或 iframe 加载完成  |
| `error` | `{ src, phase, cause }`            | 导入、初始化或文档加载失败  |

错误 `phase` 可能为：

- `component-import`：浏览器运行时动态导入失败；
- `viewer-init`：WASM、registry 或必要插件初始化失败；
- `document-load`：PDF 无法读取、解析或授权失败；
- `iframe-load`：浏览器报告 iframe 加载失败。

监听器应记录 `phase` 与 `cause`，用户界面只展示安全、可行动的文案。

## 模板 ref / Expose

```vue
<script setup lang="ts">
import { ref } from 'vue';
import type { EmbedPdfVueExpose } from '@polyloom/vue/embedpdf-vue';

const viewer = ref<EmbedPdfVueExpose>();

async function retry() {
  await viewer.value?.reload();
}
</script>

<template>
  <EmbedPdfVue ref="viewer" src="/guide.pdf" />
</template>
```

暴露值：

| 成员        | 类型                        | 说明                       |
| ----------- | --------------------------- | -------------------------- |
| `reload()`  | `() => Promise<void>`       | 销毁状态并创建全新查看实例 |
| `container` | `EmbedPdfContainer \| null` | 官方 Web Component 容器    |
| `registry`  | `PluginRegistry \| null`    | 官方插件 registry          |

不要缓存旧 registry；src 或模式变化后应重新从模板 ref 读取。

## 原生属性透传

`class`、`style`、`data-*`、`aria-*` 等未知属性透传到组件根 `<section>`。`height` 最终写入
`--pl-embedpdf-vue-height`，可被显式 `style` 继续覆盖。

## iframe 回退

```vue
<EmbedPdfVue preview-type="iframe" src="/guide.pdf" />
```

iframe 适合浏览器已提供可靠 PDF 能力、设备资源紧张或 CSP 暂时无法运行 WASM 的场景。
浏览器不保证对 iframe 内部 HTTP 404 触发 `error`，可靠状态应在服务端先验证 URL。组件
始终提供 `rel="noopener noreferrer"` 的新窗口链接。

## WASM 与 Worker

推荐把 WASM 当作应用自身资产：

```ts
import wasmUrl from '@embedpdf/pdfium/pdfium.wasm?url';
```

生产服务器应以 `application/wasm` 返回资源。查看器默认可使用 Worker；若静态托管或 CSP
环境长期停在初始化阶段，可暂设 `viewerConfig.worker: false` 定位问题。主线程运行会增加
大文档的交互开销，不应作为默认长期方案。

## CSP、CORS 与鉴权

- PDF 和远程 WASM 必须允许当前 origin 读取；
- 严格 CSP 需要允许应用自身脚本、worker、WASM 与必要的 blob URL；
- 带 Cookie 或授权头的文档应通过受控接口和官方配置处理；
- 不要把不可信 URL 直接交给组件；服务端应校验协议、主机与访问权限；
- 设置 `fonts: { ui: null, signature: null }` 可避免默认外部字体；
- 设置 `stamp: { defaultLibrary: false, libraries: [], manifests: [] }` 可避免默认印章清单。

## Nuxt 与 SSR

公开模块在初始化时不导入浏览器运行时。SSR 只输出带 `aria-busy="true"` 的语义外壳，
挂载后再动态加载查看器，所以可直接出现在 Nuxt 页面。只有 `src` 本身必须由浏览器生成时，
才需要在页面层使用 `<ClientOnly>`。

## 样式与第三方例外

PolyLoom 外壳位于 `polyloom.components` CSS Layer，使用
`.pl-embedpdf-vue*` 命名空间与 `--pl-*` 令牌。EmbedPDF 在 Web Component 内注入自己的
内部样式，这是“PolyLoom JavaScript 不隐式加载 CSS”的第三方例外；本库不复制其内部
样式，也不承诺 shadow DOM 选择器稳定。

## 无障碍

- 外壳使用 region、标题、实时状态与错误 `role="alert"`；
- 官方页码输入补充可访问名称，文档画布可通过键盘聚焦；
- 无名称 SVG 图标对辅助技术隐藏；
- PDF 页面位图使用空替代文本，避免读屏重复播报 blob URL；
- iframe 使用标题，焦点始终能到达外部打开链接；
- reduced-motion 下停止非必要动画。

PDF 内容自身是否可读仍取决于文档标签、文本层与扫描质量；查看器不能修复无标签 PDF。

## 性能

运行时按组件子路径和浏览器挂载动态加载。首次打开需要下载 PDFium WASM，建议使用长期缓存
与内容哈希。大文档应避免频繁改变 `viewerConfig` 对象引用，否则深度监听会触发重载。
由应用限制文件大小、并发查看器数量和对象 URL 生命周期。

## 故障排查

| 现象              | 优先检查                                |
| ----------------- | --------------------------------------- |
| 运行时导入失败    | 构建器是否支持 ESM、依赖是否完整        |
| 引擎初始化失败    | WASM URL、MIME、CSP、Worker             |
| 文档加载失败      | PDF 状态码、CORS、权限、文件完整性      |
| 永远停在 0%       | Worker/CSP，尝试 `worker: false` 定位   |
| 页码没有跳转      | `initialPage` 类型、文档是否完成布局    |
| iframe 404 未报错 | 浏览器限制，改由服务端预检              |
| Nuxt 水合警告     | 不要在 SSR 阶段生成随机 src 或 Blob URL |

## 源码与许可证

源码位于
[`packages/vue/src/embedpdf-vue`](https://github.com/Lee-zg/PolyLoom/tree/main/packages/vue/src/embedpdf-vue)。
PolyLoom 代码按 MIT 发布；EmbedPDF 与 PDFium 保留各自声明，详见
[第三方许可证](/maintainers/licenses/)。
