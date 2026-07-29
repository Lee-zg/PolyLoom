import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';
import { describe, expect, it } from 'vitest';
import Button from './Button.vue';

describe('Vue Button SSR', () => {
  it('在没有浏览器全局对象时完成服务端渲染', async () => {
    const app = createSSRApp(() =>
      h(
        Button,
        {
          loading: true,
        },
        () => '处理中',
      ),
    );

    const html = await renderToString(app);

    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('处理中');
  });
});
