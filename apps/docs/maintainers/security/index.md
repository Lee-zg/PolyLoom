---
title: 安全政策
description: PolyLoom 的漏洞报告、依赖治理、浏览器边界与发布凭证要求。
---

# 安全政策

## 报告漏洞

不要在公开 Issue 中披露可利用细节或凭证。按照仓库
[`SECURITY.md`](https://github.com/Lee-zg/PolyLoom/blob/main/SECURITY.md) 提供的私密渠道，
附受影响版本、复现、影响与缓解建议。

## 代码边界

- 公共入口不得在导入时访问存储、DOM 或网络；
- URL、HTML、Blob 和跨域资源由消费应用建立信任边界；
- 插件不创建隐式全局单例；
- PDF 加载遵循 CSP、CORS、鉴权和文件大小限制；
- iframe 外链使用 `noopener noreferrer`。

## 供应链

pnpm 锁定依赖、限制安装脚本并设置新版本冷却时间；Dependabot 每周更新。发布使用
GitHub Actions OIDC provenance，首发 Token 必须一次性、细粒度、受 Environment 保护。

## 支持版本

0.x 阶段只对最新发布版本提供安全修复。确认高风险漏洞后，可临时撤回受影响文档或版本，
并在完成验证后发布补丁与安全说明。
