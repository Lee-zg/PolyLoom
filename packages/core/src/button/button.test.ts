import { describe, expect, it } from 'vitest';
import { resolveButtonState } from './index';

describe('resolveButtonState', () => {
  it('在加载期间禁用按钮并暴露忙碌状态', () => {
    expect(resolveButtonState({ loading: true })).toEqual({
      ariaBusy: 'true',
      disabled: true,
    });
  });

  it('默认保持按钮可交互', () => {
    expect(resolveButtonState({})).toEqual({
      ariaBusy: undefined,
      disabled: false,
    });
  });
});
