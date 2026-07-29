import { createReadStream } from 'node:fs';
import { access, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HOST = process.env.DOCS_HOST ?? '127.0.0.1';
const PORT = Number(process.env.DOCS_PORT ?? 4321);
const DOCS_ROOT = path.resolve('apps/docs/dist');
const MIME_TYPES = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
]);

/**
 * 将请求路径约束在文档产物目录内，避免测试服务器意外暴露工作区文件。
 * @param {string} pathname
 */
function resolveRequestPath(pathname) {
  let decodedPath;

  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return undefined;
  }

  const relativePath = path.posix.normalize(decodedPath).replace(/^\/+/, '');
  const resolvedPath = path.resolve(DOCS_ROOT, relativePath);
  const isInsideDocs =
    resolvedPath === DOCS_ROOT || resolvedPath.startsWith(`${DOCS_ROOT}${path.sep}`);

  return isInsideDocs ? resolvedPath : undefined;
}

/**
 * 为静态站点解析文件和目录索引。
 * @param {string} pathname
 */
async function findStaticFile(pathname) {
  const requestedPath = resolveRequestPath(pathname);

  if (!requestedPath) {
    return undefined;
  }

  try {
    const fileStat = await stat(requestedPath);
    return fileStat.isDirectory() ? path.join(requestedPath, 'index.html') : requestedPath;
  } catch {
    return undefined;
  }
}

/** 启动文档静态服务器，并返回可由测试生命周期关闭的实例。 */
export async function startDocsServer() {
  await access(DOCS_ROOT);

  const server = createServer(async (request, response) => {
    const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? HOST}`);
    const staticFile = await findStaticFile(requestUrl.pathname);
    const responseFile = staticFile ?? path.join(DOCS_ROOT, '404.html');
    const statusCode = staticFile ? 200 : 404;

    try {
      const fileStat = await stat(responseFile);
      const contentType = MIME_TYPES.get(path.extname(responseFile).toLowerCase());

      response.writeHead(statusCode, {
        ...(contentType ? { 'Content-Type': contentType } : {}),
        'Content-Length': fileStat.size,
        'X-Content-Type-Options': 'nosniff',
      });

      if (request.method === 'HEAD') {
        response.end();
        return;
      }

      createReadStream(responseFile).pipe(response);
    } catch (error) {
      console.error('文档测试服务器读取文件失败：', error);
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Internal Server Error');
    }
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(PORT, HOST, () => {
      server.off('error', reject);
      console.log(`文档测试服务器已启动：http://${HOST}:${PORT}`);
      resolve();
    });
  });

  return server;
}

const isDirectRun =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  await startDocsServer();
}
