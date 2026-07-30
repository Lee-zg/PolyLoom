# @polyloom/plugins

框架无关、无全局单例副作用的 JavaScript 插件集合。

## 安装

```bash
pnpm add @polyloom/plugins
```

## 公开入口

| 入口                          | 内容                         |
| ----------------------------- | ---------------------------- |
| `@polyloom/plugins`           | 全部稳定插件                 |
| `@polyloom/plugins/event-bus` | 类型安全 EventBus 与公开类型 |

```ts
import { createEventBus } from '@polyloom/plugins/event-bus';

const bus = createEventBus<{ saved: { id: string } }>();
const dispose = bus.on('saved', ({ id }) => console.log(id));

bus.emit('saved', { id: '42' });
dispose();
```

`on`、`once`、`emit`、`clear` 与 `listenerCount` 都是同步 API。发布按注册顺序遍历监听器
快照，监听器异常会直接向调用方传播。

无 dependencies、peer dependencies 和 CSS，`sideEffects: false`。

[EventBus API](https://lee-zg.github.io/PolyLoom/plugins/event-bus/) ·
[包文档](https://lee-zg.github.io/PolyLoom/packages/plugins/) ·
[MIT License](https://github.com/Lee-zg/PolyLoom/blob/main/LICENSE)
