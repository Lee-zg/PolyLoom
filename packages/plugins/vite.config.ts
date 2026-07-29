import { resolve } from 'node:path';
import { createLibraryConfig } from '../../tooling/vite/create-library-config';

export default createLibraryConfig({
  entry: {
    index: resolve(import.meta.dirname, 'src/index.ts'),
    'event-bus/index': resolve(import.meta.dirname, 'src/event-bus/index.ts'),
    // @polyloom-generator:plugin-entry
  },
});
