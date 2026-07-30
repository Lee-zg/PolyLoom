---
title: '@polyloom/core'
description: PolyLoom 框架无关类型与纯逻辑包的安装、入口和依赖边界。
---

# `@polyloom/core`

框架无关的类型与纯逻辑。无运行时依赖、无 DOM、无导入副作用，适合浏览器、SSR、Node.js
与 Worker。

## 安装

```bash
pnpm add @polyloom/core
```

## 公开入口

| 入口                    | 导出                                    |
| ----------------------- | --------------------------------------- |
| `@polyloom/core`        | 当前全部稳定原语                        |
| `@polyloom/core/button` | `resolveButtonState` 与 Button 状态类型 |

```ts
import { resolveButtonState } from '@polyloom/core/button';

resolveButtonState({ loading: true });
// { ariaBusy: 'true', disabled: true }
```

## 依赖与副作用

该包没有 dependencies 和 peer dependencies，`sideEffects: false`。它不包含样式，也不会
替框架渲染组件。

## 何时使用

应用通常通过 Vue/React 包间接使用 core。只有在自定义适配层、测试或跨框架逻辑需要与
PolyLoom 保持同一状态契约时才直接安装。

源码与变更记录：
[`packages/core`](https://github.com/Lee-zg/PolyLoom/tree/main/packages/core)。
