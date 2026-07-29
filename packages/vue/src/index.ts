import type { App, Plugin } from 'vue';
import { Button } from './button/index.js';
// @polyloom-generator:vue-imports

const components = [
  ['PlButton', Button],
  // @polyloom-generator:vue-components
] as const;

/** 一次注册 @polyloom/vue 中的全部稳定组件。 */
export const PolyLoomVue: Plugin = {
  install(app: App) {
    for (const [componentName, component] of components) {
      app.component(componentName, component);
    }
  },
};

export { Button };
// @polyloom-generator:vue-exports
export type { ButtonProps } from './button/types.js';
