---
title: 导入策略与 Tree Shaking
description: 选择整库、模块、单组件、单插件和 CSS 入口，并理解依赖边界与 Tree Shaking。
---

# 导入策略与 Tree Shaking

PolyLoom 把“安装哪个包”和“从哪个入口导入”分开设计。包控制依赖边界，`exports`
子路径控制代码边界。

## 导入矩阵

| 粒度       | JavaScript                    | CSS                              | 适用场景               |
| ---------- | ----------------------------- | -------------------------------- | ---------------------- |
| 整库       | `polyloom`                    | `polyloom/style.css`             | 多框架组件目录         |
| Vue 模块   | `@polyloom/vue`               | `@polyloom/vue/style.css`        | Vue 应用全局安装       |
| React 模块 | `@polyloom/react`             | `@polyloom/react/style.css`      | React 应用使用多个组件 |
| 单组件     | `@polyloom/vue/button`        | `@polyloom/vue/button/style.css` | 页面级按需消费         |
| 单插件     | `@polyloom/plugins/event-bus` | 无                               | 精确引入一个工具       |
| 设计令牌   | 无                            | `@polyloom/theme/tokens.css`     | 只复用主题变量         |

::: code-group

```ts [Vue 模块]
import { Button, EmbedPdfVue } from '@polyloom/vue';
import '@polyloom/vue/style.css';
```

```ts [Vue 子路径]
import { Button } from '@polyloom/vue/button';
import '@polyloom/vue/button/style.css';
```

```ts [React 子路径]
import { Button } from '@polyloom/react/button';
import '@polyloom/react/button/style.css';
```

```ts [单插件]
import { createEventBus } from '@polyloom/plugins/event-bus';
```

:::

## 为什么不把每个组件发布成包

标准 `exports` 已经能限制公开入口，并让现代打包器从精确文件开始构建。这样保留单组件
引入能力，同时避免为数十个小包维护版本、依赖范围与发布顺序。

## Tree Shaking 的边界

- JavaScript 产物是 ESM，包声明无副作用或只把 CSS 标为副作用；
- 子路径入口直接指向对应构建文件，不通过包含所有组件的对象转发；
- CSS 不参与 JavaScript Tree Shaking，必须选择正确的样式入口；
- `polyloom` 的聚合入口会暴露 Vue、React、Plugins、Core 与 Theme，单框架应用不应以它
  代替模块包。

## 禁止的导入

```ts
// 实现目录不是公共 API，补丁版本也可能变化。
import Button from '@polyloom/vue/src/button/Button.vue';
```

如果一个能力没有出现在[包总览](/packages/overview/)和对应 `package.json#exports` 中，
就应视为私有实现。
