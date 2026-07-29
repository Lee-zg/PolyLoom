---
title: 设计与安装
description: 选择最小依赖边界并开始使用 PolyLoom。
---

PolyLoom 按框架和领域发布模块包。普通项目不应安装聚合包，而应只安装实际使用的模块。

## Vue

```bash
pnpm add @polyloom/vue vue
```

```ts
import { Button } from '@polyloom/vue/button';
import '@polyloom/vue/button/style.css';
```

PDF 工作台按同样规则引入：

```bash
pnpm add @embedpdf/pdfium
```

```ts
import { EmbedPdfVue } from '@polyloom/vue/embedpdf-vue';
import '@polyloom/vue/embedpdf-vue/style.css';
```

## React

```bash
pnpm add @polyloom/react react react-dom
```

```tsx
import { Button } from '@polyloom/react/button';
import '@polyloom/react/button/style.css';
```

## 整库

`polyloom` 聚合包会暴露所有框架模块，适合组件目录、文档站或同时运行多个框架的项目。

```ts
import { Core, Plugins, React, Theme, Vue } from 'polyloom';
import 'polyloom/style.css';
```
