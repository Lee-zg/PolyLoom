import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Button } from './Button';

describe('React Button SSR', () => {
  it('在没有浏览器全局对象时完成服务端渲染', () => {
    const html = renderToString(<Button loading>处理中</Button>);

    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('处理中');
  });
});
