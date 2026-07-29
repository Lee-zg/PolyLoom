import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import { createLibraryConfig } from '../../tooling/vite/create-library-config';

export default createLibraryConfig({
  entry: {
    index: resolve(import.meta.dirname, 'src/index.ts'),
    'button/index': resolve(import.meta.dirname, 'src/button/index.ts'),
    'embedpdf-vue/index': resolve(import.meta.dirname, 'src/embedpdf-vue/index.ts'),
    // @polyloom-generator:vue-entry
  },
  external: ['vue', '@embedpdf/vue-pdf-viewer', '@polyloom/core', '@polyloom/theme'],
  plugins: [vue()],
});
