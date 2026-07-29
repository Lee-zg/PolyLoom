import { describe, expect, it, vi } from 'vitest';
import { createEventBus } from './index';

interface TestEvents {
  count: number;
  message: string;
}

describe('createEventBus', () => {
  it('按注册顺序发布类型化载荷', () => {
    const eventBus = createEventBus<TestEvents>();
    const calls: string[] = [];
    eventBus.on('message', (message) => calls.push(`first:${message}`));
    eventBus.on('message', (message) => calls.push(`second:${message}`));

    eventBus.emit('message', 'ready');

    expect(calls).toEqual(['first:ready', 'second:ready']);
  });

  it('取消订阅函数可安全重复调用', () => {
    const eventBus = createEventBus<TestEvents>();
    const listener = vi.fn();
    const dispose = eventBus.on('count', listener);

    dispose();
    dispose();
    eventBus.emit('count', 1);

    expect(listener).not.toHaveBeenCalled();
    expect(eventBus.listenerCount('count')).toBe(0);
  });

  it('一次性监听器在重入发布时仍只执行一次', () => {
    const eventBus = createEventBus<TestEvents>();
    const listener = vi.fn(() => eventBus.emit('count', 2));
    eventBus.once('count', listener);

    eventBus.emit('count', 1);

    expect(listener).toHaveBeenCalledOnce();
  });

  it('可以按事件清理或清理全部监听器', () => {
    const eventBus = createEventBus<TestEvents>();
    eventBus.on('count', vi.fn());
    eventBus.on('message', vi.fn());

    eventBus.clear('count');
    expect(eventBus.listenerCount('count')).toBe(0);
    expect(eventBus.listenerCount('message')).toBe(1);

    eventBus.clear();
    expect(eventBus.listenerCount('message')).toBe(0);
  });
});
