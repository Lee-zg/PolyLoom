import { resolve } from 'node:path';
import { createLibraryConfig } from '../../tooling/vite/create-library-config';

export default createLibraryConfig({
  entry: {
    index: resolve(import.meta.dirname, 'src/index.ts'),
  },
  external: [
    '@polyloom/core',
    '@polyloom/plugins',
    '@polyloom/react',
    '@polyloom/theme',
    '@polyloom/vue',
    'react',
    'react-dom',
    'vue',
  ],
});
