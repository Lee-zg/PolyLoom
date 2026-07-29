# polyloom

PolyLoom 的整库聚合入口。它会同时暴露 Vue、React、插件、核心逻辑和主题元数据，
适合文档、组件目录或确实同时使用多个框架的项目。

```ts
import { Core, Plugins, React, Theme, Vue } from 'polyloom';
import 'polyloom/style.css';
```

单框架项目请优先安装 `@polyloom/vue` 或 `@polyloom/react`，避免引入无关 peer dependencies。
