/** PolyLoom 按钮支持的视觉层级。 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

/** PolyLoom 按钮支持的尺寸。 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/** 框架适配层计算按钮交互状态所需的最小输入。 */
export interface ButtonStateInput {
  disabled?: boolean;
  loading?: boolean;
}

/** 所有框架共享的按钮可交互状态。 */
export interface ResolvedButtonState {
  ariaBusy: 'true' | undefined;
  disabled: boolean;
}

/**
 * 统一 loading 与 disabled 的行为，防止不同框架在异步提交期间产生重复操作。
 */
export function resolveButtonState(input: ButtonStateInput): ResolvedButtonState {
  const loading = input.loading ?? false;

  return {
    ariaBusy: loading ? 'true' : undefined,
    disabled: loading || (input.disabled ?? false),
  };
}
