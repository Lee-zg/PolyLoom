---
title: '@polyloom/plugins'
description: PolyLoom 框架无关 JavaScript 插件包的安装、入口和生命周期约束。
---

# `@polyloom/plugins`

框架无关、实例隔离、无浏览器全局副作用的 JavaScript 插件集合。

## 安装

```bash
pnpm add @polyloom/plugins
```

## 公开入口

| 入口                          | 导出                                                |
| ----------------------------- | --------------------------------------------------- |
| `@polyloom/plugins`           | 所有稳定插件                                        |
| `@polyloom/plugins/event-bus` | `createEventBus`、`EventBus`、`EventMap`、`Dispose` |

```ts
import { createEventBus } from '@polyloom/plugins/event-bus';
```

## 依赖与副作用

无 dependencies、peer dependencies 和样式，`sideEffects: false`。单插件子路径不会引入
未来新增的其他插件。

当前 API 见 [EventBus 文档](/plugins/event-bus/)。
