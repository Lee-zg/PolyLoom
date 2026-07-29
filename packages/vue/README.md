# @polyloom/vue

PolyLoom 的 Vue 3 组件模块，提供显式子路径、TypeScript 类型和 SSR 安全入口。

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

## EmbedPdfVue

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

第三方许可见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。
