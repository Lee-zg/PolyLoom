/** EventBus 接受的事件映射，键是事件名，值是该事件的载荷类型。 */
export type EventMap = object;

/** 取消一个事件订阅。重复调用不会产生额外副作用。 */
export type Dispose = () => void;

/** 类型安全的进程内事件总线。 */
export interface EventBus<Events extends EventMap> {
  /** 删除某一事件或全部事件的监听器。 */
  clear<EventName extends keyof Events>(eventName?: EventName): void;
  /** 同步发布事件，监听器按照注册顺序执行。 */
  emit<EventName extends keyof Events>(eventName: EventName, payload: Events[EventName]): void;
  /** 返回指定事件当前的监听器数量。 */
  listenerCount<EventName extends keyof Events>(eventName: EventName): number;
  /** 订阅事件，并返回取消订阅函数。 */
  on<EventName extends keyof Events>(
    eventName: EventName,
    listener: (payload: Events[EventName]) => void,
  ): Dispose;
  /** 订阅一次性事件；回调执行前会先解除订阅。 */
  once<EventName extends keyof Events>(
    eventName: EventName,
    listener: (payload: Events[EventName]) => void,
  ): Dispose;
}

type UnknownListener = (payload: unknown) => void;

/**
 * 创建隔离的事件总线实例。
 *
 * 发布时会对监听器创建快照，因此回调内新增或删除监听器只影响下一次发布，
 * 避免迭代 Set 时产生顺序不稳定的问题。
 */
export function createEventBus<Events extends EventMap>(): EventBus<Events> {
  const listenerMap = new Map<keyof Events, Set<UnknownListener>>();

  function on<EventName extends keyof Events>(
    eventName: EventName,
    listener: (payload: Events[EventName]) => void,
  ): Dispose {
    const listeners = listenerMap.get(eventName) ?? new Set<UnknownListener>();
    const normalizedListener = listener as UnknownListener;
    listeners.add(normalizedListener);
    listenerMap.set(eventName, listeners);

    let disposed = false;

    return () => {
      if (disposed) {
        return;
      }

      disposed = true;
      listeners.delete(normalizedListener);

      if (listeners.size === 0) {
        listenerMap.delete(eventName);
      }
    };
  }

  return {
    clear(eventName) {
      if (eventName === undefined) {
        listenerMap.clear();
        return;
      }

      listenerMap.delete(eventName);
    },
    emit(eventName, payload) {
      const listeners = listenerMap.get(eventName);

      if (!listeners) {
        return;
      }

      for (const listener of [...listeners]) {
        listener(payload);
      }
    },
    listenerCount(eventName) {
      return listenerMap.get(eventName)?.size ?? 0;
    },
    on,
    once(eventName, listener) {
      const dispose = on(eventName, (payload) => {
        // 先解除订阅，保证回调重入 emit 时也只执行一次。
        dispose();
        listener(payload);
      });
      return dispose;
    },
  };
}
