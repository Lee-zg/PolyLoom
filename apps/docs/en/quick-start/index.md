---
title: Quick Start
description: Install and use PolyLoom in Vue, React, or TypeScript projects.
---

# Quick Start

::: code-group

```bash [Vue]
pnpm add @polyloom/vue vue
```

```bash [React]
pnpm add @polyloom/react react react-dom
```

```bash [Plugins]
pnpm add @polyloom/plugins
```

:::

```vue
<script setup lang="ts">
import { Button } from '@polyloom/vue/button';
import '@polyloom/vue/button/style.css';
</script>

<template>
  <Button>Save</Button>
</template>
```

```tsx
import { Button } from '@polyloom/react/button';
import '@polyloom/react/button/style.css';

export function SaveButton() {
  return <Button>Save</Button>;
}
```

For complete APIs, SSR notes, accessibility, PDFium, CSP, and troubleshooting, see the
[Chinese component documentation](/components/button/).
