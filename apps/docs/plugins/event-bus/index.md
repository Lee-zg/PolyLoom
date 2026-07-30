---
title: EventBus 事件总线
description: 类型安全、实例隔离、同步有序、无浏览器副作用的 JavaScript 事件总线。
---

# EventBus 事件总线

<span class="pl-api-label">TypeScript</span> <span class="pl-api-label">0 dependencies</span>
<span class="pl-api-label">SSR safe</span>

`createEventBus<Events>()` 创建一个隔离实例，用于同一 JavaScript 进程内的松耦合通知。
它不创建全局单例，不读取浏览器 API，也不跨标签页、Worker 或网络传输事件。

## 安装与按需引入

```bash
pnpm add @polyloom/plugins
```

```ts
import { createEventBus } from '@polyloom/plugins/event-bus';

interface Events {
  saved: { id: string };
  signedOut: undefined;
}

const bus = createEventBus<Events>();
const unsubscribe = bus.on('saved', ({ id }) => {
  console.log(id);
});

bus.emit('saved', { id: '42' });
unsubscribe();
```

## API

### `on(eventName, listener)`

订阅事件并返回幂等的取消函数。相同函数可以注册到多个事件，各自独立取消。

```ts
const off = bus.on('saved', handleSaved);
off();
off(); // 安全，无额外副作用
```

### `once(eventName, listener)`

只处理一次。组件会在调用监听器**之前**解除订阅，因此监听器内部重入同一事件也不会再次
执行。

```ts
bus.once('signedOut', () => cleanup());
```

### `emit(eventName, payload)`

同步、按注册顺序执行当前快照中的监听器。`emit` 返回 `void`，不收集返回值。

```ts
bus.emit('saved', { id: '42' });
bus.emit('signedOut', undefined);
```

### `clear(eventName?)`

传事件名时只清理该事件；不传参数时清空实例中的全部监听器。

```ts
bus.clear('saved');
bus.clear();
```

### `listenerCount(eventName)`

返回当前监听器数量，适合测试、诊断和生命周期断言，不建议据此驱动业务流程。

```ts
expect(bus.listenerCount('saved')).toBe(1);
```

## 同步顺序与订阅快照

`emit` 开始时复制当前监听器 Set：

1. 监听器按注册顺序同步执行；
2. 回调内新增的监听器从下一次 emit 生效；
3. 回调内取消的另一个监听器仍属于当前快照，会在本次继续执行；
4. 一次性监听器会先自我取消，所以重入安全。

这是刻意的确定性约束，可避免迭代 Set 时修改集合带来的跨运行时差异。

## 错误传播

EventBus 不捕获监听器异常。第一个抛出的异常会立即终止当前 emit，后续监听器不会执行。
业务需要隔离失败时，应在监听器内部处理并上报：

```ts
bus.on('saved', async ({ id }) => {
  try {
    await synchronize(id);
  } catch (error) {
    reportError(error);
  }
});
```

`emit` 本身不会等待 Promise。需要异步编排、失败聚合或取消时，应使用任务队列或专门的
状态管理方案。

## 实例生命周期

推荐在应用组合根、页面控制器或功能模块工厂中创建实例，再通过依赖注入传递。不要把实例
偷偷挂在 `window`；测试结束或宿主卸载时调用每个取消函数，或由实例所有者调用 `clear()`。

## Vue 配方

```ts
import { onBeforeUnmount } from 'vue';
import { createEventBus } from '@polyloom/plugins/event-bus';

const bus = createEventBus<{ refresh: undefined }>();
const off = bus.on('refresh', () => reload());

onBeforeUnmount(off);
```

## React 配方

```tsx
useEffect(() => bus.on('saved', ({ id }) => setSavedId(id)), []);
```

`on` 返回的函数正好符合 effect cleanup。确保 bus 实例引用稳定，否则应把它加入依赖数组。

## 纯 TypeScript 配方

```ts
export function createEditorSession() {
  const events = createEventBus<{ changed: { dirty: boolean } }>();

  return {
    events,
    dispose() {
      events.clear();
    },
  };
}
```

## SSR、性能与边界

模块无 DOM 和全局副作用，可在 SSR、Node.js 与 Worker 中导入。订阅和发布复杂度与单个
事件的监听器数量线性相关；它适合进程内通知，不适合作为持久化状态、消息队列或跨上下文
总线。

## 故障排查

- **事件没有类型提示**：把事件映射作为泛型传给 `createEventBus<Events>()`；
- **重复触发**：检查组件卸载时是否调用取消函数；
- **后续监听器未执行**：前一个监听器可能抛出异常；
- **异步顺序混乱**：`emit` 只同步启动回调，不等待 Promise；
- **内存增长**：确认长期实例的订阅都有明确生命周期。

## 源码与许可证

源码位于
[`packages/plugins/src/event-bus`](https://github.com/Lee-zg/PolyLoom/tree/main/packages/plugins/src/event-bus)，
按 [MIT](https://github.com/Lee-zg/PolyLoom/blob/main/LICENSE) 发布。
