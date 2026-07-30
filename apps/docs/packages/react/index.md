---
title: '@polyloom/react'
description: PolyLoom React 组件、子路径、ref 行为和 peer dependencies。
---

# `@polyloom/react`

React 组件模块。组件使用具名导出、原生属性和 ref 透传，不提供没有实际共享状态的全局
Provider。

## 安装

```bash
pnpm add @polyloom/react react react-dom
```

## 依赖

| 类型            | 依赖                                       |
| --------------- | ------------------------------------------ |
| dependency      | `@polyloom/core`、`@polyloom/theme`        |
| peer dependency | `react >=18.3 <20`、`react-dom >=18.3 <20` |

不会要求安装 Vue。

## 公开入口

| 入口                               | 内容                      |
| ---------------------------------- | ------------------------- |
| `@polyloom/react`                  | 所有稳定 React 组件与类型 |
| `@polyloom/react/button`           | Button 与 `ButtonProps`   |
| `@polyloom/react/button/style.css` | Button 令牌和样式         |
| `@polyloom/react/style.css`        | React 模块全部稳定样式    |

```tsx
import { Button } from '@polyloom/react/button';
import '@polyloom/react/button/style.css';

export function SaveAction() {
  return <Button variant="primary">保存</Button>;
}
```

当前组件 API 见 [Button 文档](/components/button/)。
