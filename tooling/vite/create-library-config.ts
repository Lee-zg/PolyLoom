import type { PluginOption, UserConfig } from 'vite';

export interface LibraryConfigOptions {
  entry: Record<string, string>;
  external?: readonly string[];
  plugins?: PluginOption[];
}

/**
 * 创建 PolyLoom 发布包的统一 Vite 配置，确保所有子路径使用一致的 ESM 输出约定。
 */
export function createLibraryConfig(options: LibraryConfigOptions): UserConfig {
  const externalPackages = options.external ?? [];

  return {
    plugins: options.plugins,
    build: {
      emptyOutDir: true,
      lib: {
        entry: options.entry,
        fileName: (_format, entryName) => `${entryName}.js`,
        formats: ['es'],
      },
      minify: false,
      rolldownOptions: {
        // 框架和工作区包由消费方解析，避免重复打包及 React/Vue 多实例问题。
        external: (moduleId) =>
          externalPackages.some(
            (packageName) => moduleId === packageName || moduleId.startsWith(`${packageName}/`),
          ),
      },
      sourcemap: true,
      target: 'es2022',
    },
  };
}
