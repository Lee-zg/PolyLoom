import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';
import { defineConfig, defineProject } from 'vitest/config';

const fromRoot = (relativePath: string) => fileURLToPath(new URL(relativePath, import.meta.url));
const workspaceAliases = [
  {
    find: '@polyloom/core/button',
    replacement: fromRoot('./packages/core/src/button/index.ts'),
  },
  {
    find: '@polyloom/core',
    replacement: fromRoot('./packages/core/src/index.ts'),
  },
];

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/index.ts',
        '**/vite.config.ts',
        'apps/**',
        'examples/**',
        'packages/lab-*/**',
        'packages/polyloom/**',
        'packages/theme/**',
        'tooling/**',
      ],
      include: [
        'packages/core/src/**/*.{ts,tsx}',
        'packages/plugins/src/**/*.{ts,tsx}',
        'packages/react/src/**/*.{ts,tsx}',
        'packages/vue/src/**/*.{ts,vue}',
      ],
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        branches: 85,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
    projects: [
      defineProject({
        resolve: {
          alias: workspaceAliases,
        },
        test: {
          environment: 'node',
          include: ['packages/core/src/**/*.test.ts', 'packages/plugins/src/**/*.test.ts'],
          name: 'core-and-plugins',
        },
      }),
      defineProject({
        plugins: [vue()],
        resolve: {
          alias: workspaceAliases,
        },
        test: {
          environment: 'jsdom',
          include: ['packages/vue/src/**/*.unit.test.ts'],
          name: 'vue',
          setupFiles: [fromRoot('./tooling/test/setup-dom.ts')],
        },
      }),
      defineProject({
        resolve: {
          alias: workspaceAliases,
        },
        test: {
          environment: 'jsdom',
          include: ['packages/react/src/**/*.unit.test.tsx'],
          name: 'react',
          setupFiles: [fromRoot('./tooling/test/setup-dom.ts')],
        },
      }),
      defineProject({
        plugins: [vue()],
        resolve: {
          alias: workspaceAliases,
        },
        test: {
          environment: 'node',
          include: ['packages/vue/src/**/*.ssr.test.ts', 'packages/react/src/**/*.ssr.test.tsx'],
          name: 'ssr',
        },
      }),
    ],
  },
});
