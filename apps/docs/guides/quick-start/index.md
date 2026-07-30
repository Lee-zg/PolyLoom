---
title: 五分钟快速开始
description: 安装 PolyLoom，并在 Vue、React 或纯 TypeScript 项目中完成第一次按需引入。
---

# 五分钟快速开始

## 环境要求

- 消费端使用支持 ESM 与 `exports` 的现代构建工具；
- Vue 组件要求 Vue `>=3.5 <4`；
- React 组件要求 React 与 React DOM `>=18.3 <20`；
- 仓库开发要求 Node.js `>=22.12`，推荐 Node.js 24 LTS。

## 选择需要的包

::: code-group

```bash [Vue / pnpm]
pnpm add @polyloom/vue vue
```

```bash [React / pnpm]
pnpm add @polyloom/react react react-dom
```

```bash [插件 / pnpm]
pnpm add @polyloom/plugins
```

:::

也可以把 `pnpm add` 替换为 `npm install` 或 `yarn add`。普通项目优先安装模块包，
只有确实同时需要多个框架时才安装 `polyloom`。

## Vue：按需 Button

```vue
<script setup lang="ts">
import { Button } from '@polyloom/vue/button';
import '@polyloom/vue/button/style.css';
</script>

<template>
  <Button variant="primary" @click="save">保存</Button>
</template>
```

要全局注册 Vue 组件：

```ts
import { createApp } from 'vue';
import { PolyLoomVue } from '@polyloom/vue';
import '@polyloom/vue/style.css';
import App from './App.vue';

createApp(App).use(PolyLoomVue).mount('#app');
```

## React：按需 Button

```tsx
import { Button } from '@polyloom/react/button';
import '@polyloom/react/button/style.css';

export function SaveAction() {
  return <Button onClick={() => save()}>保存</Button>;
}
```

## TypeScript：创建 EventBus

```ts
import { createEventBus } from '@polyloom/plugins/event-bus';

type Events = {
  saved: { id: string };
};

const bus = createEventBus<Events>();
const unsubscribe = bus.on('saved', ({ id }) => console.log(id));

bus.emit('saved', { id: '42' });
unsubscribe();
```

## 验证按需引入

构建产物中，`@polyloom/vue/button` 不应包含 EmbedPdfVue，单组件 CSS 也不应包含其他组件
样式。若构建工具报告无法解析深层源码路径，请改用文档列出的公开入口，不要导入
`@polyloom/vue/src/*`。

继续阅读：[导入策略](/guides/imports/)与[主题和样式](/guides/theme/)。
