---
title: 包总览与依赖边界
description: PolyLoom 六个公开 npm 包的职责、依赖关系、安装选择与全部公开入口。
---

# 包总览与依赖边界

PolyLoom 按可独立消费的模块发布，而不是为每个小组件建立 npm 包。六个包都从 `0.1.0`
开始独立遵循 SemVer。

## 依赖关系

```text
@polyloom/core ─────┬──> @polyloom/vue ────┐
                    └──> @polyloom/react ──┤
@polyloom/theme ────┴──────────────────────┤
@polyloom/plugins ─────────────────────────┤
                                           └──> polyloom
```

`@polyloom/vue` 另外依赖 `@embedpdf/vue-pdf-viewer`，并把 Vue 声明为 peer。
`@polyloom/react` 把 React 与 React DOM 声明为 peer。

## 如何选择

| 需求                   | 安装                |
| ---------------------- | ------------------- |
| Vue 应用               | `@polyloom/vue`     |
| React 应用             | `@polyloom/react`   |
| 只用 EventBus          | `@polyloom/plugins` |
| 只用令牌/CSS           | `@polyloom/theme`   |
| 复用纯状态逻辑         | `@polyloom/core`    |
| 同时建立多框架组件目录 | `polyloom`          |

单框架项目不要默认安装聚合包。这样 Vue 消费者不需要 React，React 消费者也不需要 Vue。

## 公开 exports 速查

| 包                  | JavaScript / 类型                 | CSS                                                                 |
| ------------------- | --------------------------------- | ------------------------------------------------------------------- |
| `@polyloom/core`    | `.`, `./button`                   | —                                                                   |
| `@polyloom/theme`   | `.`                               | `./tokens.css`, `./button.css`, `./embedpdf-vue.css`, `./style.css` |
| `@polyloom/plugins` | `.`, `./event-bus`                | —                                                                   |
| `@polyloom/vue`     | `.`, `./button`, `./embedpdf-vue` | 对应组件 `style.css`、模块 `style.css`                              |
| `@polyloom/react`   | `.`, `./button`                   | Button 与模块 `style.css`                                           |
| `polyloom`          | `.`                               | `./style.css`                                                       |

每个包的 README、类型声明和构建文件都包含在 `pnpm pack` 产物中；CI 会从 tarball 建立临时
消费项目验证这些入口。
