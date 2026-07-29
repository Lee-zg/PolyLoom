import { Button } from '@polyloom/react/button';
import { useEffect, useRef, useState } from 'react';
import '@polyloom/react/button/style.css';

/** 文档中运行的 React Button 交互示例。 */
export default function ReactButtonDemo() {
  const [count, setCount] = useState(0);
  const demoRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // 水合标记仅供浏览器测试等待交互就绪，直接同步 DOM 可避免额外渲染。
    if (demoRef.current) {
      demoRef.current.dataset.hydrated = 'true';
    }
  }, []);

  return (
    <section
      ref={demoRef}
      className="pl-demo-card"
      data-demo-framework="react"
      data-hydrated="false"
    >
      <p className="pl-demo-card__label">REACT / REF FORWARDING</p>
      <div className="pl-demo-card__actions">
        <Button onClick={() => setCount((value) => value + 1)}>编织 {count}</Button>
        <Button variant="secondary">检查</Button>
        <Button variant="ghost">退回</Button>
      </div>
    </section>
  );
}
