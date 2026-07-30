---
title: 测试矩阵
description: PolyLoom 的单元、SSR、浏览器、无障碍、文档和 npm tarball 验收策略。
---

# 测试矩阵

## 测试层级

| 层级   | 工具                      | 关注点                           |
| ------ | ------------------------- | -------------------------------- |
| 单元   | Vitest                    | 状态、事件、边界、错误与清理     |
| Vue    | Vue Test Utils            | props、attrs、slot、emit、Expose |
| React  | Testing Library           | children、原生属性、ref、事件    |
| SSR    | Vue/React server renderer | 无浏览器全局时可导入和渲染       |
| 浏览器 | Playwright                | 真实交互、主题、响应式与三引擎   |
| 无障碍 | axe + 语义断言            | serious/critical 为零、键盘焦点  |
| 包产物 | pnpm pack/publint/ATTW    | exports、类型、CSS、依赖隔离     |
| 文档   | VitePress build           | 死链、SEO、搜索和静态 HTML       |

## CI 策略

Pull Request 跑 Chromium，`main` 与发布跑 Chromium、Firefox、WebKit。浏览器测试使用文档
自己的 PDF 与 WASM fixture，不依赖外网。PDFium 对资源敏感，CI 限制 worker 数避免竞态
型假失败。

## tarball 消费

测试不会直接引用工作区源码，而是打包六个 npm tarball，再建立临时 Vue、React 和聚合
消费项目。它验证根入口、模块、单组件、单插件、类型、CSS 和动态 chunk，并确认 Vue-only
项目不安装 React 或 Svelte。

## 覆盖率不是唯一门槛

覆盖率用于发现未执行路径，但稳定入口还必须有行为断言。新增异常分支、资源订阅或 SSR
逻辑时，应测试“发生了什么”和“是否清理”，而非只让行数变绿。
