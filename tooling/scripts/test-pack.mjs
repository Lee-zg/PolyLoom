import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const temporaryRoot = await mkdtemp(join(tmpdir(), 'polyloom-pack-'));
const archiveRoot = resolve(temporaryRoot, 'archives');
const publicPackages = [
  '@polyloom/core',
  '@polyloom/theme',
  '@polyloom/plugins',
  '@polyloom/vue',
  '@polyloom/react',
  'polyloom',
];

function resolveExecutable(command) {
  const fileName = process.platform === 'win32' ? `${command}.cmd` : command;

  for (const pathEntry of (process.env.PATH ?? '').split(delimiter)) {
    const candidate = resolve(pathEntry, fileName);

    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return fileName;
}

function run(command, args, cwd = workspaceRoot) {
  const executable = resolveExecutable(command);
  const windowsCommand = [executable, ...args]
    .map((argument) => `"${argument.replaceAll('"', '""')}"`)
    .join(' ');
  const spawnOptions = {
    cwd,
    encoding: 'utf8',
    stdio: 'pipe',
  };
  const result =
    process.platform === 'win32'
      ? spawnSync(windowsCommand, { ...spawnOptions, shell: true })
      : spawnSync(executable, args, spawnOptions);

  if (result.status !== 0) {
    throw new Error(
      [`命令失败：${command} ${args.join(' ')}`, result.stdout, result.stderr]
        .filter(Boolean)
        .join('\n'),
    );
  }

  return result.stdout;
}

async function writeConsumer(name, dependencies, source, frameworks) {
  const consumerRoot = resolve(temporaryRoot, name);
  const rootManifest = JSON.parse(await readFile(resolve(workspaceRoot, 'package.json'), 'utf8'));
  const fileDependencies = Object.fromEntries(
    Object.entries(dependencies).map(([packageName, archivePath]) => [
      packageName,
      archivePath.startsWith('file:') ? archivePath : `file:${archivePath.replaceAll('\\', '/')}`,
    ]),
  );

  await mkdir(resolve(consumerRoot, 'src'), { recursive: true });
  await writeFile(
    resolve(consumerRoot, 'package.json'),
    `${JSON.stringify(
      {
        name: `polyloom-pack-test-${name}`,
        version: '0.0.0',
        private: true,
        type: 'module',
        scripts: {
          build: 'tsc --noEmit && vite build',
        },
        dependencies: {
          ...fileDependencies,
          ...(frameworks.includes('react')
            ? {
                react: rootManifest.devDependencies.react,
                'react-dom': rootManifest.devDependencies['react-dom'],
              }
            : {}),
          ...(frameworks.includes('vue') ? { vue: rootManifest.devDependencies.vue } : {}),
        },
        devDependencies: {
          ...(frameworks.includes('react')
            ? {
                '@types/react': rootManifest.devDependencies['@types/react'],
                '@types/react-dom': rootManifest.devDependencies['@types/react-dom'],
              }
            : {}),
          typescript: rootManifest.devDependencies.typescript,
          vite: rootManifest.devDependencies.vite,
        },
      },
      null,
      2,
    )}\n`,
    'utf8',
  );
  await writeFile(
    resolve(consumerRoot, 'pnpm-workspace.yaml'),
    [
      'packages:',
      "  - '.'",
      '',
      'overrides:',
      ...Object.entries(fileDependencies).map(
        ([packageName, archivePath]) => `  '${packageName}': '${archivePath}'`,
      ),
      '',
    ].join('\n'),
    'utf8',
  );
  await writeFile(
    resolve(consumerRoot, 'tsconfig.json'),
    `${JSON.stringify(
      {
        compilerOptions: {
          lib: ['ES2022', 'DOM'],
          module: 'ESNext',
          moduleResolution: 'Bundler',
          noEmit: true,
          strict: true,
          target: 'ES2022',
          types: ['vite/client'],
        },
        include: ['src'],
      },
      null,
      2,
    )}\n`,
    'utf8',
  );
  await writeFile(
    resolve(consumerRoot, 'index.html'),
    '<!doctype html><html><body><div id="app"></div><script type="module" src="/src/index.ts"></script></body></html>\n',
    'utf8',
  );
  await writeFile(resolve(consumerRoot, 'src/index.ts'), source, 'utf8');

  run('pnpm', ['install', '--ignore-scripts'], consumerRoot);

  if (name === 'vue') {
    for (const unrelatedFramework of ['react', 'react-dom', 'svelte']) {
      if (existsSync(resolve(consumerRoot, 'node_modules', unrelatedFramework))) {
        throw new Error(`Vue-only 消费项目不应安装 ${unrelatedFramework}`);
      }
    }
  }

  run('pnpm', ['run', 'build'], consumerRoot);
}

try {
  await mkdir(archiveRoot, { recursive: true });
  const archiveMap = {};

  for (const packageName of publicPackages) {
    const before = new Set(await readdir(archiveRoot));
    run('pnpm', ['--filter', packageName, 'pack', '--pack-destination', archiveRoot]);
    const after = await readdir(archiveRoot);
    const archiveName = after.find(
      (fileName) => !before.has(fileName) && fileName.endsWith('.tgz'),
    );

    if (!archiveName) {
      throw new Error(`未找到 ${packageName} 的打包产物`);
    }

    archiveMap[packageName] = resolve(archiveRoot, archiveName);
  }

  const vueDistRoot = resolve(workspaceRoot, 'packages/vue/dist');
  const embedPdfEntry = await readFile(resolve(vueDistRoot, 'embedpdf-vue/index.js'), 'utf8');
  const embedPdfChunks = await Promise.all(
    (await readdir(vueDistRoot))
      .filter((fileName) => fileName.startsWith('embedpdf-vue-') && fileName.endsWith('.js'))
      .map((fileName) => readFile(resolve(vueDistRoot, fileName), 'utf8')),
  );
  const embedPdfJavaScript = [embedPdfEntry, ...embedPdfChunks].join('\n');
  const embedPdfStyle = await readFile(resolve(vueDistRoot, 'embedpdf-vue/style.css'), 'utf8');

  if (!embedPdfJavaScript.includes('import("@embedpdf/vue-pdf-viewer")')) {
    throw new Error('EmbedPdfVue 产物未保留浏览器阶段的动态导入');
  }
  if (embedPdfJavaScript.includes('PlButton') || embedPdfStyle.includes('.pl-button')) {
    throw new Error('EmbedPdfVue 单组件产物意外包含 Button 或模块全量样式');
  }

  const reactStyle = await readFile(
    resolve(workspaceRoot, 'packages/react/dist/style.css'),
    'utf8',
  );
  if (reactStyle.includes('.pl-embedpdf-vue')) {
    throw new Error('React 模块产物意外包含 Vue 的 EmbedPdfVue 样式');
  }

  await writeConsumer(
    'vue',
    {
      '@polyloom/core': archiveMap['@polyloom/core'],
      '@polyloom/theme': archiveMap['@polyloom/theme'],
      '@polyloom/vue': archiveMap['@polyloom/vue'],
    },
    `import { PolyLoomVue } from '@polyloom/vue';\nimport { Button } from '@polyloom/vue/button';\nimport '@polyloom/vue/button/style.css';\nimport { EmbedPdfVue, type EmbedPdfVueError } from '@polyloom/vue/embedpdf-vue';\nimport '@polyloom/vue/embedpdf-vue/style.css';\nimport { createApp, h } from 'vue';\nconst onPdfError = (error: EmbedPdfVueError) => console.error(error.phase);\nconst app = createApp({ render: () => h('main', [h(Button, null, () => 'Vue'), h(EmbedPdfVue, { src: '/fixture.pdf', onError: onPdfError })]) });\napp.use(PolyLoomVue).mount('#app');\n`,
    ['vue'],
  );
  await writeConsumer(
    'react',
    {
      '@polyloom/core': archiveMap['@polyloom/core'],
      '@polyloom/theme': archiveMap['@polyloom/theme'],
      '@polyloom/react': archiveMap['@polyloom/react'],
    },
    `import { Button } from '@polyloom/react/button';\nimport '@polyloom/react/button/style.css';\nimport { createElement } from 'react';\nconst value = createElement(Button, null, 'React');\nconsole.log(value.type);\n`,
    ['react'],
  );
  await writeConsumer(
    'aggregate',
    archiveMap,
    `import { Core, Plugins, React, Theme, Vue } from 'polyloom';\nimport 'polyloom/style.css';\nimport { createEventBus } from '@polyloom/plugins/event-bus';\nconst bus = createEventBus<{ ready: boolean }>();\nbus.emit('ready', true);\nconsole.log(Core, Plugins, React, Theme, Vue);\n`,
    ['react', 'vue'],
  );

  console.log('npm tarball 已在隔离的 Vue、React 与整库消费项目中通过类型和 Vite 构建。');
} finally {
  if (process.env.POLYLOOM_KEEP_PACK_TEMP) {
    console.warn(`已保留打包验证目录：${temporaryRoot}`);
  } else {
    await rm(temporaryRoot, { force: true, recursive: true });
  }
}
