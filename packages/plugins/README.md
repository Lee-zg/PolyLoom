# @polyloom/plugins

框架无关、无全局单例副作用的 JavaScript 插件集合。

```ts
import { createEventBus } from '@polyloom/plugins/event-bus';

const bus = createEventBus<{ saved: { id: string } }>();
const dispose = bus.on('saved', ({ id }) => console.log(id));
```
