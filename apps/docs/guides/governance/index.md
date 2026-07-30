---
title: 历史代码准入
description: PolyLoom 历史组件和插件从私有实验区进入公开包的治理门槛。
---

# 历史代码准入

此 URL 为早期文档兼容入口，完整维护流程见[维护者：历史代码准入](/maintainers/governance/)。

公开迁移必须确认来源与许可，移除业务依赖，建立稳定 API、SSR 和无障碍契约，并通过
单元、浏览器与 tarball 消费测试。未达到条件的内容保留在私有 `lab-vue` 或
`lab-react`，不会出现在 npm 产物中。
