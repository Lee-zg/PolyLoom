---
title: 贡献指南
description: PolyLoom 的开发环境、分支、中文提交、质量检查和 Pull Request 要求。
---

# 贡献指南

## 开发环境

- Node.js 24 LTS；
- pnpm 11.9；
- Git；
- Chromium（完整浏览器矩阵由 CI 执行）。

```bash
git clone https://github.com/Lee-zg/PolyLoom.git
cd PolyLoom
pnpm install
pnpm docs:dev
```

## 工作流

1. 从最新 `main` 创建职责单一的功能分支；
2. 使用生成器建立组件或插件骨架；
3. 实现源码、类型、测试、元数据和文档；
4. 添加 Changeset（首个未发布版本的仓库初始化除外）；
5. 运行与改动范围相称的检查；
6. 使用中文 commit message，创建 Pull Request。

## 编码要求

- 保持公开 API 小而明确，禁止依赖未声明的深层入口；
- 注释解释设计原因、边界和特殊处理，不重复代码；
- 浏览器 API 延迟到函数调用或挂载；
- 新组件必须支持键盘、可访问名称与 reduced-motion；
- CSS 使用 `.pl-*`、`--pl-*` 和既有 Layer；
- 依赖必须说明必要性、许可、体积和 SSR 影响。

## 提交前检查

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm validate:exports
pnpm validate:packages
pnpm test:pack
pnpm docs:build
pnpm test:e2e
```

仅修改文案时可先运行文档构建与相关 E2E，但 PR 合并门禁仍会执行完整 CI。

## Pull Request 清单

- 说明动机、公开 API 和兼容性影响；
- 列出测试结果与必要截图；
- 同步根导出、子路径、样式、元数据、文档和侧栏；
- 涉及历史代码时附来源与许可证据；
- 不在代码、日志、Issue 或 PR 中写入 Token。

行为规范、安全披露与更完整规则见仓库
[`CONTRIBUTING.md`](https://github.com/Lee-zg/PolyLoom/blob/main/CONTRIBUTING.md)。
