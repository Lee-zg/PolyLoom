import { resolveButtonState, type ButtonSize, type ButtonVariant } from '@polyloom/core/button';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

/** React Button 的公开属性。 */
export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'disabled' | 'size'
> {
  disabled?: boolean;
  loading?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

/**
 * PolyLoom React 按钮。ref 与未知原生属性都会透传到实际 button 元素。
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    disabled = false,
    loading = false,
    size = 'md',
    type = 'button',
    variant = 'primary',
    ...nativeButtonProps
  },
  forwardedRef,
) {
  const buttonState = resolveButtonState({
    disabled,
    loading,
  });
  const classes = ['pl-button', `pl-button--${variant}`, `pl-button--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      {...nativeButtonProps}
      ref={forwardedRef}
      aria-busy={buttonState.ariaBusy}
      className={classes}
      disabled={buttonState.disabled}
      type={type}
    >
      {loading ? <span aria-hidden="true" className="pl-button__spinner" /> : null}
      <span className="pl-button__label">{children}</span>
    </button>
  );
});
