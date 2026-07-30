---
title: 组件与插件生成器
description: 使用 PolyLoom 生成器创建源码、测试、元数据、文档模板和入口登记。
---

# 组件与插件生成器

生成器负责建立结构与登记标记，减少漏改入口；它不会替代 API 设计和审查。

## 命令

```bash
pnpm generate component vue status-chip
pnpm generate component react status-chip
pnpm generate plugin clipboard
```

名称使用小写 kebab-case。稳定性状态默认遵循生成器提示，新能力在 API 未验证前应保持
experimental。

## 生成内容

- 源码与公开类型；
- 单元测试模板；
- `component.meta.json`；
- 主题 CSS 模板（组件适用）；
- 文档页面；
- Vite 多入口、根入口和生成器登记点。

## 完成后必须人工处理

1. 写清语义、默认值和错误策略；
2. 根据框架习惯实现 attrs/slot 或 ref/children；
3. 增加真实边界测试和 SSR 测试；
4. 补齐 API 表、交互示例、可访问性和排障；
5. 把稳定入口登记到 VitePress 侧栏；
6. 运行 `pnpm validate:exports`。

校验器会拒绝缺少子路径、CSS、API 文档、示例或侧栏登记的稳定入口。
