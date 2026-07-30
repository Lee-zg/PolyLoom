# @polyloom/theme

PolyLoom 的设计令牌与框架无关组件样式。

## 安装

```bash
pnpm add @polyloom/theme
```

## 公开入口

| 入口                               | 内容                        |
| ---------------------------------- | --------------------------- |
| `@polyloom/theme`                  | `tokenNames` 与 `TokenName` |
| `@polyloom/theme/tokens.css`       | 明暗主题变量                |
| `@polyloom/theme/button.css`       | Button 结构样式             |
| `@polyloom/theme/embedpdf-vue.css` | EmbedPdfVue 外壳样式        |
| `@polyloom/theme/style.css`        | 令牌与全部稳定组件样式      |

```ts
import '@polyloom/theme/tokens.css';
import '@polyloom/theme/button.css';
```

使用 `data-pl-theme="dark"` 启用深色主题。所有变量均以 `--pl-` 开头，组件类名以
`.pl-` 开头，不包含全局 reset。

该包无 dependencies 和 peer dependencies。CSS 位于显式 Layer 中，并在
`sideEffects` 中单独标记。

[主题指南](https://lee-zg.github.io/PolyLoom/guides/theme/) ·
[包文档](https://lee-zg.github.io/PolyLoom/packages/theme/) ·
[MIT License](https://github.com/Lee-zg/PolyLoom/blob/main/LICENSE)
