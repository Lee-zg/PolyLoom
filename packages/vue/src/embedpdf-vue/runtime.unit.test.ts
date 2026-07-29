import { describe, expect, it } from 'vitest';
import { loadEmbedPdfVueRuntime } from './runtime.js';

describe('EmbedPdfVue 浏览器运行时', () => {
  it('按需加载官方 Vue 查看器', async () => {
    const runtime = await loadEmbedPdfVueRuntime();

    expect(runtime.PDFViewer).toBeDefined();
  });
});
