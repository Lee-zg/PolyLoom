---
title: EventBus
description: 类型安全、实例隔离、无浏览器副作用的同步事件总线。
---

```ts
import { createEventBus } from '@polyloom/plugins/event-bus';

interface Events {
  saved: { id: string };
  signedOut: undefined;
}

const bus = createEventBus<Events>();
const dispose = bus.on('saved', ({ id }) => {
  console.log(id);
});

bus.emit('saved', { id: '42' });
dispose();
```

`on` 与 `once` 都返回幂等的取消函数。`emit` 使用当前监听器快照并按注册顺序同步执行；
监听器内部的订阅变化从下一次发布开始生效。
