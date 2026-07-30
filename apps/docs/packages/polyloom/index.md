---
title: polyloom 聚合包
description: PolyLoom 整库聚合入口的用途、依赖成本和公开导出。
---

# `polyloom` 聚合包

聚合 Vue、React、Plugins、Core 与 Theme 的目录入口，适合文档站、跨框架组件浏览器或
确实同时运行两个框架的工具。

## 安装

```bash
pnpm add polyloom vue react react-dom
```

## 依赖

它依赖五个 `@polyloom/*` 模块包，并把 Vue、React 与 React DOM 全部声明为 peer。
单框架应用优先安装对应模块包，避免无关 peer 和解析成本。

## 公开入口

| 入口                 | 内容                                                |
| -------------------- | --------------------------------------------------- |
| `polyloom`           | `Core`、`Plugins`、`React`、`Theme`、`Vue` 命名空间 |
| `polyloom/style.css` | 全部稳定主题和组件样式                              |

```ts
import { Core, Plugins, React, Theme, Vue } from 'polyloom';
import 'polyloom/style.css';

const bus = Plugins.createEventBus<{ ready: undefined }>();
const VueButton = Vue.Button;
const ReactButton = React.Button;
console.log(Core.resolveButtonState({ loading: true }), Theme.tokenNames);
```

聚合包不新增运行时行为，只转发模块包的公开 API。精确按需引入仍应直接使用
`@polyloom/vue/button` 等模块子路径。
