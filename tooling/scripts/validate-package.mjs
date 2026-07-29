import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = process.cwd();
const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const temporaryRoot = await mkdtemp(join(tmpdir(), 'polyloom-package-check-'));

function resolveExecutable(command) {
  const fileName = process.platform === 'win32' ? `${command}.cmd` : command;

  if (['attw', 'publint'].includes(command)) {
    return resolve(workspaceRoot, 'node_modules/.bin', fileName);
  }

  for (const pathEntry of (process.env.PATH ?? '').split(delimiter)) {
    const candidate = resolve(pathEntry, fileName);

    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return fileName;
}

function run(command, args) {
  const executable = resolveExecutable(command);
  const windowsCommand = [executable, ...args]
    .map((argument) => `"${argument.replaceAll('"', '""')}"`)
    .join(' ');
  const spawnOptions = {
    cwd: packageRoot,
    encoding: 'utf8',
    stdio: 'inherit',
  };
  const result =
    process.platform === 'win32'
      ? spawnSync(windowsCommand, { ...spawnOptions, shell: true })
      : spawnSync(executable, args, spawnOptions);

  if (result.status !== 0) {
    throw new Error(`命令失败：${command} ${args.join(' ')}`);
  }
}

try {
  run('publint', []);
  run('pnpm', ['pack', '--pack-destination', temporaryRoot]);

  const archiveName = (await readdir(temporaryRoot)).find((fileName) => fileName.endsWith('.tgz'));

  if (!archiveName) {
    throw new Error('pnpm pack 未生成 tarball');
  }

  const packageJson = JSON.parse(await readFile(resolve(packageRoot, 'package.json'), 'utf8'));
  const entrypoints = Object.entries(packageJson.exports)
    .filter(
      ([exportName, exportValue]) =>
        !exportName.endsWith('.css') &&
        typeof exportValue === 'object' &&
        typeof exportValue.import === 'string',
    )
    .map(([exportName]) => exportName);

  const attwArguments = [
    resolve(temporaryRoot, archiveName),
    '--profile',
    'esm-only',
    '--entrypoints',
    ...entrypoints,
  ];

  if (packageJson.name === '@polyloom/vue') {
    // Node16 类型解析器不了解 .vue 声明后缀；Vue 官方工具链使用 bundler 解析且该行必须保持绿色。
    attwArguments.push('--ignore-rules', 'internal-resolution-error');
  }

  // ATTW 的 --pack 固定调用 npm；先用 pnpm 打包可保持项目统一的包管理器与发布转换规则。
  run('attw', attwArguments);
} finally {
  await rm(temporaryRoot, { force: true, recursive: true });
}
