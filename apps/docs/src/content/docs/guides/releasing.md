---
title: 发布流程
description: 首发凭证、完整验收与 npm Trusted Publishing 切换约定。
---

PolyLoom 的 npm 发布只从 GitHub Actions 的 `release.yml` 执行。首次发布使用放在
`npm` Environment 中的一次性细粒度 Token；包创建成功后立即切换到 GitHub OIDC，
仓库不长期保存 npm 凭证。

## 0.1.0 首发

首发前必须完成 npm `polyloom` 组织、账号 2FA、六个包名检查和
`NPM_TOKEN_BOOTSTRAP` Environment Secret。维护者在 Actions 中手动运行“发布 npm
包”，并勾选 `initial_release`。工作流先执行全套静态、单元、SSR、tarball 和三浏览器
验收；全部通过后才会发布包、核对 provenance，并建立包级与统一 GitHub Release。

## 后续版本

六个包创建后，为每个包设置相同的 Trusted Publisher：
`Lee-zg/PolyLoom`、`release.yml`、Environment `npm`。随后撤销 Token、删除 Secret，
并把仓库变量 `NPM_TRUSTED_PUBLISHING_READY` 设为 `true`。

功能 PR 通过 `pnpm changeset` 描述版本影响。合并后 Changesets 创建版本 PR；版本 PR
合并时，工作流以 OIDC 发布受影响的包并附带 provenance。

完整操作清单见仓库 [`PUBLISHING.md`](https://github.com/Lee-zg/PolyLoom/blob/main/PUBLISHING.md)。
