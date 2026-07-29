import { resolve } from 'node:path';
import { createLibraryConfig } from '../../tooling/vite/create-library-config';

export default createLibraryConfig({
  entry: {
    index: resolve(import.meta.dirname, 'src/index.ts'),
    'button/index': resolve(import.meta.dirname, 'src/button/index.ts'),
  },
});
