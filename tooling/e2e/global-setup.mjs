import { startDocsServer } from '../scripts/serve-docs.mjs';

/** 在 Playwright 主进程内管理静态服务器，避免跨平台子进程残留。 */
export default async function globalSetup() {
  const server = await startDocsServer();

  return async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  };
}
