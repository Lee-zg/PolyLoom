---
title: 版本、Changesets 与发布
description: PolyLoom 的 SemVer、Changesets、npm provenance、Trusted Publishing 和 GitHub Release 流程。
---

# 版本、Changesets 与发布

## 版本模型

六个公开包独立遵循 SemVer。Changesets 根据变更影响计算包版本、内部依赖范围与
CHANGELOG；聚合包在依赖模块变化时同步更新。

```bash
pnpm changeset
pnpm version-packages
```

0.1.0 是全部包尚未进入 registry 时的首次版本，因此仓库初始化不再额外添加 Changeset。

## 发布门禁

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

## 固定顺序

1. 完整验收；
2. 发布受影响的 npm 包；
3. 验证 registry 版本、README、安装与 provenance；
4. 创建包级 tags 和 GitHub Releases；
5. 创建统一版本 Release；
6. 验证 Pages 与文档链接。

先验证再建 Release，避免 registry 失败时留下看似成功的公开版本。

## 0.1.0 首发

首发要求维护者先创建 npm `@polyloom` 组织、启用 2FA，并把一次性细粒度 Token 直接保存
到 GitHub `npm` Environment 的 `NPM_TOKEN_BOOTSTRAP`。Token 不得进入代码、日志或对话。
手动触发 `release.yml` 并设置 `initial_release=true`。

## Trusted Publishing

包存在后，为六个包分别配置 GitHub Actions Trusted Publisher：

- repository：`Lee-zg/PolyLoom`；
- workflow：`release.yml`；
- environment：`npm`。

随后撤销一次性 Token、删除 Secret，并把仓库变量
`NPM_TRUSTED_PUBLISHING_READY=true`。后续由 Changesets Action 通过 OIDC 发布，不保存
长期 npm Token。

仓库操作清单见
[`PUBLISHING.md`](https://github.com/Lee-zg/PolyLoom/blob/main/PUBLISHING.md)。
