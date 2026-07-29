import type { ButtonSize, ButtonVariant } from '@polyloom/core/button';

/** Vue Button 的公开属性。原生 button 属性通过 attrs 继续透传。 */
export interface ButtonProps {
  disabled?: boolean;
  loading?: boolean;
  size?: ButtonSize;
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
}
