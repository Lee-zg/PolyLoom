import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { EmbedPdfVue } from '../index.js';
import { loadEmbedPdfVueRuntime } from './runtime.js';

vi.mock('./runtime.js', () => ({
  loadEmbedPdfVueRuntime: vi.fn(),
}));

describe('EmbedPdfVue SSR', () => {
  it('无浏览器全局对象时输出占位外壳且不加载运行时', async () => {
    expect(globalThis.window).toBeUndefined();
    expect(globalThis.document).toBeUndefined();

    const app = createSSRApp(() =>
      h(EmbedPdfVue, {
        src: '/server-document.pdf',
        title: '服务端文档',
      }),
    );
    const html = await renderToString(app);

    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('服务端文档');
    expect(html).toContain('正在准备 PDF');
    expect(loadEmbedPdfVueRuntime).not.toHaveBeenCalled();
  });
});
