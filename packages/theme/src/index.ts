/**
 * 可在 CSS-in-JS、设计工具或文档中复用的默认令牌名称。
 * 实际主题值仍以 CSS 自定义属性为唯一视觉来源。
 */
export const tokenNames = {
  accent: '--pl-color-accent',
  background: '--pl-color-background',
  border: '--pl-color-border',
  foreground: '--pl-color-foreground',
  focus: '--pl-color-focus',
  radius: '--pl-radius-control',
} as const;

/** PolyLoom 公开的设计令牌名称。 */
export type TokenName = (typeof tokenNames)[keyof typeof tokenNames];
