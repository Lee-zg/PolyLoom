<script setup lang="ts">
import type { Root } from 'react-dom/client';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const hostElement = ref<HTMLDivElement>();
let reactRoot: Root | undefined;

onMounted(async () => {
  if (!hostElement.value) {
    return;
  }

  // React DOM 只在客户端装载，避免 VitePress SSR 导入浏览器运行时。
  const [{ createElement }, { createRoot }, { default: ReactButtonDemo }] = await Promise.all([
    import('react'),
    import('react-dom/client'),
    import('./ReactButtonDemo'),
  ]);

  reactRoot = createRoot(hostElement.value);
  reactRoot.render(createElement(ReactButtonDemo));
});

onBeforeUnmount(() => {
  reactRoot?.unmount();
  reactRoot = undefined;
});
</script>

<template>
  <div ref="hostElement" class="pl-react-host" aria-live="polite">
    <p class="pl-react-host__placeholder">正在装载 React 示例…</p>
  </div>
</template>
