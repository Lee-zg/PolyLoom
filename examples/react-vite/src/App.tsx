import { Button } from '@polyloom/react/button';
import { useState } from 'react';

/** React 消费项目的最小真实示例。 */
export function App() {
  const [saveCount, setSaveCount] = useState(0);

  return (
    <main className="demo-shell">
      <p className="demo-kicker">REACT ADAPTER / 0.1.0</p>
      <h1>
        一根纬线，
        <br />
        一种原生手感。
      </h1>
      <p className="demo-copy">当前保存次数：{saveCount}</p>
      <div className="demo-actions">
        <Button onClick={() => setSaveCount((count) => count + 1)}>保存变更</Button>
        <Button variant="secondary">预览</Button>
        <Button variant="ghost">取消</Button>
      </div>
    </main>
  );
}
