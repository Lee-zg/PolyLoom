# @polyloom/core

PolyLoom 各框架适配层共享的类型与纯逻辑。该包不会访问 DOM，也不会在导入时产生副作用。

## 安装

```bash
pnpm add @polyloom/core
```

## 公开入口

| 入口                    | 内容                                   |
| ----------------------- | -------------------------------------- |
| `@polyloom/core`        | 当前全部稳定原语                       |
| `@polyloom/core/button` | Button 状态类型与 `resolveButtonState` |

```ts
import { resolveButtonState } from '@polyloom/core/button';

const state = resolveButtonState({ loading: true });
// { ariaBusy: 'true', disabled: true }
```

无 dependencies、peer dependencies 和 CSS，`sideEffects: false`。适合浏览器、SSR、Node.js
与 Worker。

[完整文档](https://lee-zg.github.io/PolyLoom/packages/core/) ·
[源码](https://github.com/Lee-zg/PolyLoom/tree/main/packages/core) ·
[MIT License](https://github.com/Lee-zg/PolyLoom/blob/main/LICENSE)
