import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const [kind, target, rawName] = process.argv.slice(2);
const componentFrameworks = new Set(['vue', 'react']);

function usage() {
  console.log('组件：pnpm generate component <vue|react> <kebab-name>');
  console.log('插件：pnpm generate plugin <kebab-name>');
}

function toPascalCase(value) {
  return value
    .split('-')
    .map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`)
    .join('');
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function updateJson(path, update) {
  const value = JSON.parse(await readFile(path, 'utf8'));
  update(value);
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function insertBeforeMarker(path, marker, content) {
  const source = await readFile(path, 'utf8');

  if (!source.includes(marker)) {
    throw new Error(`${path} 缺少生成器标记：${marker}`);
  }

  await writeFile(path, source.replace(marker, `${content}\n    ${marker}`), 'utf8');
}

async function writeFiles(files) {
  for (const [path, content] of files) {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content, { encoding: 'utf8', flag: 'wx' });
  }
}

async function generateComponent(framework, name) {
  if (!componentFrameworks.has(framework)) {
    throw new Error('组件框架必须是 vue 或 react');
  }

  const displayName = toPascalCase(name);
  const packageRoot = resolve(workspaceRoot, `packages/${framework}`);
  const componentRoot = resolve(packageRoot, `src/${name}`);
  const docsPath = resolve(workspaceRoot, `apps/docs/components/${name}/index.md`);
  const stylePath = resolve(workspaceRoot, `packages/theme/src/${name}.css`);

  if (await exists(componentRoot)) {
    throw new Error(`${framework}/${name} 已存在`);
  }

  const metadata = `${JSON.stringify(
    {
      name,
      displayName,
      status: 'experimental',
      since: 'unreleased',
      origin: 'original',
      license: 'MIT',
    },
    null,
    2,
  )}\n`;

  if (framework === 'vue') {
    await writeFiles([
      [
        resolve(componentRoot, `${displayName}.vue`),
        `<script setup lang="ts">\ndefineOptions({ name: 'Pl${displayName}' });\n</script>\n\n<template>\n  <div class="pl-${name}"><slot /></div>\n</template>\n`,
      ],
      [
        resolve(componentRoot, 'index.ts'),
        `export { default as ${displayName} } from './${displayName}.vue';\n`,
      ],
      [
        resolve(componentRoot, `${name}.unit.test.ts`),
        `import { mount } from '@vue/test-utils';\nimport { describe, expect, it } from 'vitest';\nimport ${displayName} from './${displayName}.vue';\n\ndescribe('Vue ${displayName}', () => {\n  it('渲染默认插槽', () => {\n    const wrapper = mount(${displayName}, { slots: { default: '内容' } });\n    expect(wrapper.text()).toBe('内容');\n  });\n});\n`,
      ],
      [resolve(componentRoot, 'component.meta.json'), metadata],
    ]);
  } else {
    await writeFiles([
      [
        resolve(componentRoot, `${displayName}.tsx`),
        `import type { HTMLAttributes, PropsWithChildren } from 'react';\n\n/** ${displayName} 的公开属性。 */\nexport type ${displayName}Props = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;\n\n/** 尚在实验阶段的 ${displayName}。 */\nexport function ${displayName}({ children, className, ...props }: ${displayName}Props) {\n  return <div {...props} className={['pl-${name}', className].filter(Boolean).join(' ')}>{children}</div>;\n}\n`,
      ],
      [
        resolve(componentRoot, 'index.ts'),
        `export { ${displayName} } from './${displayName}.js';\nexport type { ${displayName}Props } from './${displayName}.js';\n`,
      ],
      [
        resolve(componentRoot, `${name}.unit.test.tsx`),
        `import { render, screen } from '@testing-library/react';\nimport { describe, expect, it } from 'vitest';\nimport { ${displayName} } from './${displayName}';\n\ndescribe('React ${displayName}', () => {\n  it('渲染 children', () => {\n    render(<${displayName}>内容</${displayName}>);\n    expect(screen.getByText('内容')).toBeVisible();\n  });\n});\n`,
      ],
      [resolve(componentRoot, 'component.meta.json'), metadata],
    ]);
  }

  await writeFiles([
    [
      stylePath,
      `@layer polyloom.components {\n  .pl-${name} {\n    color: var(--pl-color-foreground);\n  }\n}\n`,
    ],
    [
      docsPath,
      `---\ntitle: ${displayName}\ndescription: 实验阶段组件，API 在首次稳定发布前可能变化。\n---\n\n# ${displayName}\n\n::: warning 实验入口\n该组件只从 \`@polyloom/${framework}/experimental/${name}\` 导出，不包含在模块根入口中。\n:::\n\n## 示例\n\n待补充可运行示例。\n\n## API\n\n稳定前必须补齐属性、事件、插槽或 children、ref、无障碍、SSR 与故障排查。\n`,
    ],
  ]);

  await updateJson(resolve(packageRoot, 'package.json'), (packageJson) => {
    packageJson.exports[`./experimental/${name}`] = {
      types: `./dist/${name}/index.d.ts`,
      import: `./dist/${name}/index.js`,
    };
    packageJson.exports[`./experimental/${name}/style.css`] = `./dist/${name}/style.css`;
  });
  await insertBeforeMarker(
    resolve(packageRoot, 'vite.config.ts'),
    `// @polyloom-generator:${framework}-entry`,
    `'${name}/index': resolve(import.meta.dirname, 'src/${name}/index.ts'),`,
  );
}

async function generatePlugin(name) {
  const displayName = toPascalCase(name);
  const packageRoot = resolve(workspaceRoot, 'packages/plugins');
  const pluginRoot = resolve(packageRoot, `src/${name}`);

  if (await exists(pluginRoot)) {
    throw new Error(`plugins/${name} 已存在`);
  }

  await writeFiles([
    [
      resolve(pluginRoot, 'index.ts'),
      `/** ${displayName} 的配置。 */\nexport interface ${displayName}Options {\n  enabled?: boolean;\n}\n\n/** 创建隔离的 ${displayName} 插件实例。 */\nexport function create${displayName}(options: ${displayName}Options = {}) {\n  return { enabled: options.enabled ?? true } as const;\n}\n`,
    ],
    [
      resolve(pluginRoot, `${name}.test.ts`),
      `import { describe, expect, it } from 'vitest';\nimport { create${displayName} } from './index';\n\ndescribe('create${displayName}', () => {\n  it('使用安全默认值', () => {\n    expect(create${displayName}().enabled).toBe(true);\n  });\n});\n`,
    ],
    [
      resolve(pluginRoot, 'component.meta.json'),
      `${JSON.stringify(
        {
          name,
          status: 'experimental',
          since: 'unreleased',
          origin: 'original',
          license: 'MIT',
        },
        null,
        2,
      )}\n`,
    ],
    [
      resolve(workspaceRoot, `apps/docs/plugins/${name}/index.md`),
      `---\ntitle: ${displayName}\ndescription: 实验阶段插件，API 在首次稳定发布前可能变化。\n---\n\n# ${displayName}\n\n::: warning 实验入口\n从 \`@polyloom/plugins/experimental/${name}\` 导入。\n:::\n\n## 示例\n\n待补充类型安全的最小示例。\n\n## API\n\n稳定前必须补齐生命周期、错误传播、SSR、性能与故障排查。\n`,
    ],
  ]);

  await updateJson(resolve(packageRoot, 'package.json'), (packageJson) => {
    packageJson.exports[`./experimental/${name}`] = {
      types: `./dist/${name}/index.d.ts`,
      import: `./dist/${name}/index.js`,
    };
  });
  await insertBeforeMarker(
    resolve(packageRoot, 'vite.config.ts'),
    '// @polyloom-generator:plugin-entry',
    `'${name}/index': resolve(import.meta.dirname, 'src/${name}/index.ts'),`,
  );
}

try {
  if (kind === 'component' && target && rawName) {
    if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(rawName)) {
      throw new Error('名称必须使用 kebab-case');
    }
    await generateComponent(target, rawName);
    console.log(`已创建实验组件：@polyloom/${target}/experimental/${rawName}`);
  } else if (kind === 'plugin' && target && !rawName) {
    if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(target)) {
      throw new Error('名称必须使用 kebab-case');
    }
    await generatePlugin(target);
    console.log(`已创建实验插件：@polyloom/plugins/experimental/${target}`);
  } else {
    usage();
    process.exitCode = 1;
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  usage();
  process.exitCode = 1;
}
