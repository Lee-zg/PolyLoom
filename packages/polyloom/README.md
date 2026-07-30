# polyloom

PolyLoom 的整库聚合入口。它会同时暴露 Vue、React、插件、核心逻辑和主题元数据，
适合文档、组件目录或确实同时使用多个框架的项目。

## 安装

```bash
pnpm add polyloom vue react react-dom
```

## 公开入口

| 入口                 | 内容                                       |
| -------------------- | ------------------------------------------ |
| `polyloom`           | `Core`、`Plugins`、`React`、`Theme`、`Vue` |
| `polyloom/style.css` | 全部稳定主题和组件样式                     |

```ts
import { Core, Plugins, React, Theme, Vue } from 'polyloom';
import 'polyloom/style.css';
```

单框架项目请优先安装 `@polyloom/vue` 或 `@polyloom/react`，避免引入无关 peer dependencies。

聚合包依赖五个 `@polyloom/*` 模块，并把 Vue、React 与 React DOM 全部声明为 peer。它不新增
运行时行为，只转发模块包的公开 API。

[导入矩阵](https://lee-zg.github.io/PolyLoom/guides/imports/) ·
[包文档](https://lee-zg.github.io/PolyLoom/packages/polyloom/) ·
[MIT License](https://github.com/Lee-zg/PolyLoom/blob/main/LICENSE) ·
[第三方声明](./THIRD_PARTY_NOTICES.md)
