# PolyLoom 0.1.0

PolyLoom 首次公开发布：一个通过标准子路径按需消费的多框架 UI 组件与 JavaScript
插件库。

## 包清单

- `@polyloom/core@0.1.0`
- `@polyloom/theme@0.1.0`
- `@polyloom/plugins@0.1.0`
- `@polyloom/vue@0.1.0`
- `@polyloom/react@0.1.0`
- `polyloom@0.1.0`

## EmbedPdfVue

```ts
import { EmbedPdfVue } from '@polyloom/vue/embedpdf-vue';
import '@polyloom/vue/embedpdf-vue/style.css';
```

组件保留历史实现的 `src`、`title`、`previewType`、`defaultZoom` 与 `initialPage`
使用方式，并增加 `height`、`wasmUrl`、`viewerConfig`、生命周期事件和可重试接口。
运行时只在浏览器挂载后加载，可用于现代 SSR；iframe 模式作为原生回退。

## 链接

- 文档：<https://lee-zg.github.io/PolyLoom/>
- npm：<https://www.npmjs.com/package/polyloom>
- 源码：<https://github.com/Lee-zg/PolyLoom>

## 第三方许可与限制

EmbedPdfVue 使用 MIT 许可的 EmbedPDF 查看器与 PDFium。完整归属见
`THIRD_PARTY_NOTICES.md`。

首次 npm 发布需要维护者先完成 `@polyloom` 组织、2FA 与可信发布者配置。iframe
加载错误是否上报受浏览器实现限制；跨域 PDF、WASM 与 CSP 需要由消费应用正确配置。
