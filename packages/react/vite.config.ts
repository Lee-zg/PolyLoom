import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { createLibraryConfig } from '../../tooling/vite/create-library-config';

export default createLibraryConfig({
  entry: {
    index: resolve(import.meta.dirname, 'src/index.ts'),
    'button/index': resolve(import.meta.dirname, 'src/button/index.ts'),
    // @polyloom-generator:react-entry
  },
  external: ['react', 'react-dom', '@polyloom/core', '@polyloom/theme'],
  plugins: [react()],
});
