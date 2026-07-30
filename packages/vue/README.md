# @polyloom/vue

PolyLoom 的 Vue 3 组件模块，提供显式子路径、TypeScript 类型和 SSR 安全入口。

## 安装

```bash
pnpm add @polyloom/vue vue
```

## 模块与按需入口

```ts
import { createApp } from 'vue';
import { PolyLoomVue } from '@polyloom/vue';
import '@polyloom/vue/style.css';

createApp(App).use(PolyLoomVue).mount('#app');
```

按需引入：

```ts
import { Button } from '@polyloom/vue/button';
import '@polyloom/vue/button/style.css';
```

| 入口                                   | 内容                         |
| -------------------------------------- | ---------------------------- |
| `@polyloom/vue`                        | 全部稳定组件与 `PolyLoomVue` |
| `@polyloom/vue/button`                 | Button 与类型                |
| `@polyloom/vue/button/style.css`       | Button 令牌与样式            |
| `@polyloom/vue/embedpdf-vue`           | EmbedPdfVue 与公开类型       |
| `@polyloom/vue/embedpdf-vue/style.css` | PDF 工作台令牌与外壳样式     |
| `@polyloom/vue/style.css`              | Vue 模块全部稳定样式         |

## EmbedPdfVue

需要由构建器托管 PDFium WASM 时，直接安装 `@embedpdf/pdfium`：

```bash
pnpm add @embedpdf/pdfium
```

```vue
<script setup lang="ts">
import wasmUrl from '@embedpdf/pdfium/pdfium.wasm?url';
import { EmbedPdfVue } from '@polyloom/vue/embedpdf-vue';
import '@polyloom/vue/embedpdf-vue/style.css';
</script>

<template>
  <EmbedPdfVue src="/guide.pdf" :wasm-url="wasmUrl" title="使用指南" @error="console.error" />
</template>
```

`EmbedPdfVue` 使用 `@embedpdf/vue-pdf-viewer`，只在浏览器挂载后加载运行时。PDFium
WASM 若交给 Vite 打包，请在应用中直接安装 `@embedpdf/pdfium`。组件提供
`init`、`ready`、`load`、`error` 事件，并通过模板 ref 暴露 `reload()`、`container`
与 `registry`。

完整 API 和部署说明：<https://lee-zg.github.io/PolyLoom/components/embedpdf-vue/>

运行依赖为 `@polyloom/core`、`@polyloom/theme` 与 `@embedpdf/vue-pdf-viewer`；
peer dependency 为 `vue >=3.5 <4`。Vue 消费者无需安装 React、React DOM 或 Svelte。

[Button API](https://lee-zg.github.io/PolyLoom/components/button/) ·
[包文档](https://lee-zg.github.io/PolyLoom/packages/vue/) ·
[MIT License](https://github.com/Lee-zg/PolyLoom/blob/main/LICENSE)

第三方许可见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。
