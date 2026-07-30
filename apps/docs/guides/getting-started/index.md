---
title: 项目介绍与设计原则
description: 理解 PolyLoom 的目标、包边界、公开 API 原则和首版支持范围。
---

# 项目介绍与设计原则

<p class="pl-lead">PolyLoom 用于长期整理个人历史项目中的 UI 组件与 JavaScript 插件。它不是把所有代码复制进一个目录，而是给每段代码建立可消费、可测试、可追溯的边界。</p>

## 解决什么问题

历史代码通常绑定业务样式、框架版本或隐式全局变量，直接复用会把旧项目的偶然约束带到
新项目。PolyLoom 通过 monorepo 统一基础设施，同时按发布模块拆包：

- `core` 保存不依赖 DOM 的类型与纯逻辑；
- `theme` 保存 `--pl-*` 令牌和 `.pl-*` 样式；
- `plugins` 保存实例隔离的工具；
- `vue` 与 `react` 各自遵循框架习惯；
- `polyloom` 仅承担整库聚合，不作为单框架项目的默认选择。

## 设计原则

### 公开边界可枚举

消费者只能从 `package.json#exports` 声明的入口导入。根入口提供发现性，子路径负责精确
消费；未声明的源码目录都属于实现细节。

### 共享语义，不共享框架偶然性

Vue 与 React 的同名组件共享视觉、状态和无障碍契约。Vue 保留 slot、attrs、emit 与
模板 ref；React 保留 children、受控属性、原生事件与 ref。

### 样式由消费者显式选择

JavaScript 不隐式加载 PolyLoom CSS。可只导入单组件样式，也可导入框架模块或整库样式。
所有样式位于 CSS Layer 中，不包含全局 reset。

### 导入即 SSR 安全

公开入口在模块初始化阶段不访问 `window`、`document` 或 `localStorage`。需要浏览器 API
的功能延迟到挂载或函数调用阶段。

### 历史来源可追溯

历史代码先进入私有 `lab-*` 包，记录来源、提交、依赖、原许可证与成熟度。完成许可、
安全、API、测试、SSR、无障碍和文档检查后才可进入公开包。

## 首版范围

0.1.0 提供 Vue/React Button、类型安全 EventBus 和 Vue `EmbedPdfVue`。面向现代浏览器、
ESM、Vite、Webpack 5 与现代 SSR；不提供 CJS、UMD、IE 或 Vue 2 产物。

下一步：[五分钟快速开始](/guides/quick-start/)。
