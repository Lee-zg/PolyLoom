# 发布 PolyLoom

PolyLoom 使用 Changesets 管理后续版本，并通过 GitHub Actions 与 npm Trusted
Publishing 发布。任何发布都必须从 `main` 的已验证提交产生。

## 首次发布 0.1.0

1. 在 npm 创建 `polyloom` 组织，确认六个公开包名可用，并为账号启用 2FA。
2. 创建仅允许发布六个包、可绕过发布 2FA 的一次性细粒度 Token。
3. 在 GitHub 创建 `npm` Environment，把 Token 保存为
   `NPM_TOKEN_BOOTSTRAP`；不要写入仓库、终端历史或任务对话。
4. 合并功能 PR并确认 CI 与 Pages 成功后，手动运行“发布 npm 包”工作流，
   勾选 `initial_release`。
5. 工作流会重复执行完整验收，发布六个 `0.1.0` 包，验证 provenance，再创建
   包级标签、包级 Release 和统一的 `v0.1.0` Release。

缺少组织、2FA 或 Secret 时不得运行首发工作流。发布部分成功时先核对 registry，
再幂等重跑；禁止改名后继续保留旧 scope 的第二套公开入口。

## 切换到 Trusted Publishing

首发成功后，在六个 npm 包的 Trusted Publisher 设置中逐一配置：

- 仓库：`Lee-zg/PolyLoom`
- Workflow：`release.yml`
- Environment：`npm`

确认所有包配置完成后：

1. 立即撤销一次性 npm Token。
2. 删除 GitHub `npm` Environment 中的 `NPM_TOKEN_BOOTSTRAP`。
3. 创建仓库变量 `NPM_TRUSTED_PUBLISHING_READY=true`。

此后合并带 Changeset 的变更时，工作流会创建版本 PR；版本 PR 合并后仅发布受影响
的包，并由 GitHub OIDC 生成 npm provenance。

## 本地验收

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

本地命令不会发布 npm 包，也不会创建 GitHub Release。
