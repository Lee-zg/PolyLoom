---
title: 发布流程
description: PolyLoom 从质量验收到 Changesets、npm provenance 和 GitHub Release 的发布顺序。
---

# 发布流程

此 URL 为早期文档兼容入口，完整流程见[维护者：版本与发布](/maintainers/releasing/)。

发布顺序固定为：完整验收、发布受影响包、验证 registry 与 provenance、建立标签和
GitHub Releases。0.1.0 首发在 npm 组织、2FA 与一次性细粒度 Token 未就绪前必须暂停。
