---
title: Import Matrix
description: Choose aggregate, framework, component, plugin, and CSS entry points in PolyLoom.
---

# Import Matrix

| Scope          | JavaScript                    | CSS                                |
| -------------- | ----------------------------- | ---------------------------------- |
| Everything     | `polyloom`                    | `polyloom/style.css`               |
| Vue module     | `@polyloom/vue`               | `@polyloom/vue/style.css`          |
| React module   | `@polyloom/react`             | `@polyloom/react/style.css`        |
| Vue Button     | `@polyloom/vue/button`        | `@polyloom/vue/button/style.css`   |
| React Button   | `@polyloom/react/button`      | `@polyloom/react/button/style.css` |
| Vue PDF viewer | `@polyloom/vue/embedpdf-vue`  | matching `style.css`               |
| EventBus       | `@polyloom/plugins/event-bus` | none                               |

Install the framework package you need. The `polyloom` aggregate declares Vue, React, and React DOM
as peers and is intended for multi-framework catalogs rather than ordinary single-framework apps.

See the [full Chinese import guide](/guides/imports/) for Tree Shaking and package boundary details.
