# @polyloom/react

PolyLoom 的 React 组件模块，使用具名导出、原生属性和 ref 透传。

## 安装

```bash
pnpm add @polyloom/react react react-dom
```

## 公开入口

| 入口                               | 内容                    |
| ---------------------------------- | ----------------------- |
| `@polyloom/react`                  | 全部稳定 React 组件     |
| `@polyloom/react/button`           | Button 与 `ButtonProps` |
| `@polyloom/react/button/style.css` | Button 令牌与样式       |
| `@polyloom/react/style.css`        | React 模块全部稳定样式  |

```tsx
import { Button } from '@polyloom/react/button';
import '@polyloom/react/button/style.css';

export function SaveAction() {
  return <Button variant="primary">保存</Button>;
}
```

运行依赖为 `@polyloom/core` 与 `@polyloom/theme`；peer dependencies 为
`react >=18.3 <20`、`react-dom >=18.3 <20`。React 消费者无需安装 Vue。

[Button API](https://lee-zg.github.io/PolyLoom/components/button/) ·
[包文档](https://lee-zg.github.io/PolyLoom/packages/react/) ·
[MIT License](https://github.com/Lee-zg/PolyLoom/blob/main/LICENSE)
