---
title: PolyLoom Overview
description: An English overview of PolyLoom, a multi-framework UI component and JavaScript plugin library.
---

# PolyLoom Overview

PolyLoom turns reusable code from past projects into maintained Vue, React, framework-agnostic, and
JavaScript plugin packages. Explicit package exports support module and component-level imports
without publishing a package for every small component.

## Packages

| Package             | Purpose                               |
| ------------------- | ------------------------------------- |
| `@polyloom/core`    | Framework-agnostic types and behavior |
| `@polyloom/theme`   | Design tokens and component CSS       |
| `@polyloom/plugins` | Side-effect-free JavaScript plugins   |
| `@polyloom/vue`     | Vue 3 components and installer        |
| `@polyloom/react`   | React components                      |
| `polyloom`          | Multi-framework aggregate entry       |

Version 0.1.0 includes Vue and React Button components, a typed EventBus, and the SSR-safe
`EmbedPdfVue` workbench with a native iframe fallback.

[Quick Start](/en/quick-start/) · [Import Matrix](/en/imports/) ·
[Full Chinese documentation](/guides/getting-started/)
