import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const failures = [];

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

function requireCondition(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

async function validateFramework(framework) {
  const packageRoot = resolve(workspaceRoot, `packages/${framework}`);
  const packageJson = await readJson(resolve(packageRoot, 'package.json'));
  const sourceIndex = await readFile(resolve(packageRoot, 'src/index.ts'), 'utf8');
  const viteConfig = await readFile(resolve(packageRoot, 'vite.config.ts'), 'utf8');
  const sourceEntries = await readdir(resolve(packageRoot, 'src'), { withFileTypes: true });

  for (const entry of sourceEntries.filter((candidate) => candidate.isDirectory())) {
    const metadataPath = resolve(packageRoot, 'src', entry.name, 'component.meta.json');

    if (!(await pathExists(metadataPath))) {
      continue;
    }

    const metadata = await readJson(metadataPath);
    const exportPrefix =
      metadata.status === 'stable' ? `./${entry.name}` : `./experimental/${entry.name}`;

    requireCondition(
      Boolean(packageJson.exports[exportPrefix]),
      `${packageJson.name} 缺少 ${exportPrefix} JavaScript 导出`,
    );
    requireCondition(
      Boolean(packageJson.exports[`${exportPrefix}/style.css`]),
      `${packageJson.name} 缺少 ${exportPrefix}/style.css 导出`,
    );
    requireCondition(
      viteConfig.includes(`'${entry.name}/index'`),
      `${packageJson.name} 的 Vite 多入口未登记 ${entry.name}`,
    );
    requireCondition(
      await pathExists(resolve(workspaceRoot, `packages/theme/src/${entry.name}.css`)),
      `@polyloom/theme 缺少 ${entry.name}.css`,
    );
    requireCondition(
      (await pathExists(
        resolve(workspaceRoot, `apps/docs/src/content/docs/components/${entry.name}.mdx`),
      )) ||
        (await pathExists(
          resolve(workspaceRoot, `apps/docs/src/content/docs/components/${entry.name}.md`),
        )),
      `文档站缺少组件 ${entry.name} 的页面`,
    );

    if (metadata.status === 'stable') {
      requireCondition(
        sourceIndex.includes(entry.name),
        `${packageJson.name} 根入口未导出稳定组件 ${entry.name}`,
      );
    }
  }
}

async function validatePlugins() {
  const packageRoot = resolve(workspaceRoot, 'packages/plugins');
  const packageJson = await readJson(resolve(packageRoot, 'package.json'));
  const sourceIndex = await readFile(resolve(packageRoot, 'src/index.ts'), 'utf8');
  const viteConfig = await readFile(resolve(packageRoot, 'vite.config.ts'), 'utf8');
  const sourceEntries = await readdir(resolve(packageRoot, 'src'), { withFileTypes: true });

  for (const entry of sourceEntries.filter((candidate) => candidate.isDirectory())) {
    const metadataPath = resolve(packageRoot, 'src', entry.name, 'component.meta.json');

    if (!(await pathExists(metadataPath))) {
      continue;
    }

    const metadata = await readJson(metadataPath);
    const exportPath =
      metadata.status === 'stable' ? `./${entry.name}` : `./experimental/${entry.name}`;

    requireCondition(
      Boolean(packageJson.exports[exportPath]),
      `${packageJson.name} 缺少 ${exportPath} 导出`,
    );
    requireCondition(
      viteConfig.includes(`'${entry.name}/index'`),
      `${packageJson.name} 的 Vite 多入口未登记 ${entry.name}`,
    );
    requireCondition(
      await pathExists(
        resolve(workspaceRoot, `apps/docs/src/content/docs/plugins/${entry.name}.md`),
      ),
      `文档站缺少插件 ${entry.name} 的页面`,
    );

    if (metadata.status === 'stable') {
      requireCondition(
        sourceIndex.includes(entry.name),
        `${packageJson.name} 根入口未导出稳定插件 ${entry.name}`,
      );
    }
  }
}

async function validateBuiltTargets() {
  const publicPackageDirectories = ['core', 'theme', 'plugins', 'vue', 'react', 'polyloom'];

  for (const directory of publicPackageDirectories) {
    const packageRoot = resolve(workspaceRoot, `packages/${directory}`);
    const distRoot = resolve(packageRoot, 'dist');

    if (!(await pathExists(distRoot))) {
      continue;
    }

    const packageJson = await readJson(resolve(packageRoot, 'package.json'));

    for (const [exportName, exportValue] of Object.entries(packageJson.exports)) {
      const targets =
        typeof exportValue === 'string'
          ? [exportValue]
          : Object.values(exportValue).filter((value) => typeof value === 'string');

      for (const target of targets) {
        requireCondition(
          await pathExists(resolve(packageRoot, target)),
          `${packageJson.name} 的 ${exportName} 指向不存在的 ${target}`,
        );
      }
    }
  }
}

await Promise.all([validateFramework('vue'), validateFramework('react'), validatePlugins()]);
await validateBuiltTargets();

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exitCode = 1;
} else {
  console.log('公开入口、组件元数据、样式和文档登记一致。');
}
