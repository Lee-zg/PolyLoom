# PolyLoom

> 把散落在历史项目里的前端代码，编织成可独立消费、可持续演进的模块。

PolyLoom 是一个面向个人长期维护的多框架前端库。Vue、React、框架无关逻辑、主题和
JavaScript 插件分别发布，同时通过聚合包提供完整目录视图。

## 导入边界

```ts
// 整库：适合组件目录或同时运行多个框架的项目
import { Core, Plugins, React, Theme, Vue } from 'polyloom';

// 框架模块
import { Button } from '@polyloom/vue';

// 单组件
import { Button } from '@polyloom/vue/button';
import '@polyloom/vue/button/style.css';

// 单插件
import { createEventBus } from '@polyloom/plugins/event-bus';
```

| 包                  | 用途                         |
| ------------------- | ---------------------------- |
| `@polyloom/core`    | 框架无关类型与纯逻辑         |
| `@polyloom/theme`   | CSS 变量、主题与组件样式     |
| `@polyloom/plugins` | 无框架依赖的 JavaScript 插件 |
| `@polyloom/vue`     | Vue 3 组件与安装器           |
| `@polyloom/react`   | React 组件                   |
| `polyloom`          | 全部模块的聚合入口           |

## 本地开发

需要 Node.js 24 LTS 和 pnpm 11.9。

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm docs:dev
```

新增内容必须先从实验入口开始：

```bash
pnpm generate component vue status-chip
pnpm generate component react status-chip
pnpm generate plugin clipboard
```

完整准入流程见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## English

PolyLoom is a personal, multi-framework frontend library for curating reusable UI components
and JavaScript plugins. Packages are split by framework and domain, while explicit subpath
exports allow consumers to import one module or one component without installing a package for
every small unit.

The first release includes equivalent Vue 3 and React Button components, shared design tokens,
a typed EventBus, SSR-safe entry points, package-consumer fixtures, and an Astro documentation
site.

## License

[MIT](./LICENSE)
