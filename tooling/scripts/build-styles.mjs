import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const themeSourceRoot = resolve(workspaceRoot, 'packages/theme/src');
const [targetName] = process.argv.slice(2);
const targetComponentNames = {
  polyloom: null,
  react: new Set(['button']),
  theme: null,
  vue: new Set(['button', 'embedpdf-vue']),
};

if (!targetName || !['theme', 'vue', 'react', 'polyloom'].includes(targetName)) {
  throw new Error('用法：node tooling/scripts/build-styles.mjs <theme|vue|react|polyloom>');
}

const tokensCss = await readFile(resolve(themeSourceRoot, 'tokens.css'), 'utf8');
const allowedComponentNames = targetComponentNames[targetName];
const componentStyleNames = (await readdir(themeSourceRoot))
  .filter((fileName) => fileName.endsWith('.css') && fileName !== 'tokens.css')
  .map((fileName) => fileName.slice(0, -'.css'.length))
  // 框架包只携带自己的组件样式，避免 Vue 专属 CSS 污染 React 的发布产物。
  .filter(
    (componentName) => allowedComponentNames === null || allowedComponentNames.has(componentName),
  )
  .sort();
const componentStyles = await Promise.all(
  componentStyleNames.map(async (componentName) => ({
    componentName,
    css: await readFile(resolve(themeSourceRoot, `${componentName}.css`), 'utf8'),
  })),
);

const banner = '/* PolyLoom styles · MIT License */\n';
const completeStyle = `${banner}${tokensCss.trim()}\n\n${componentStyles
  .map(({ css }) => css.trim())
  .join('\n\n')}\n`;

async function writeStyle(relativePath, content) {
  const outputPath = resolve(workspaceRoot, relativePath);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, content, 'utf8');
}

if (targetName === 'theme') {
  await Promise.all([
    writeStyle('packages/theme/dist/tokens.css', `${banner}${tokensCss.trim()}\n`),
    ...componentStyles.map(({ componentName, css }) =>
      writeStyle(`packages/theme/dist/${componentName}.css`, `${banner}${css.trim()}\n`),
    ),
    writeStyle('packages/theme/dist/style.css', completeStyle),
  ]);
} else {
  const packageRoot = targetName === 'polyloom' ? 'packages/polyloom' : `packages/${targetName}`;
  await Promise.all([
    ...componentStyles.map(({ componentName, css }) =>
      writeStyle(
        `${packageRoot}/dist/${componentName}/style.css`,
        `${banner}${tokensCss.trim()}\n\n${css.trim()}\n`,
      ),
    ),
    writeStyle(`${packageRoot}/dist/style.css`, completeStyle),
  ]);
}
