<script setup lang="ts">
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';

defineOptions({ name: 'PolyLoomBreadcrumbs' });

const { page } = useData();
const sectionLabels: Record<string, string> = {
  components: '组件',
  en: 'English',
  guides: '指南',
  maintainers: '维护者',
  packages: '包',
  plugins: '插件',
};
const sectionHrefs: Record<string, string> = {
  components: '/components/button/',
  en: '/en/',
  guides: '/guides/getting-started/',
  maintainers: '/maintainers/contributing/',
  packages: '/packages/overview/',
  plugins: '/plugins/event-bus/',
};

const breadcrumbs = computed(() => {
  const segments = page.value.relativePath
    .replace(/\/?index\.md$/, '')
    .split('/')
    .filter(Boolean);

  return segments.map((segment, index) => {
    const href = withBase(
      index === 0 && sectionHrefs[segment]
        ? sectionHrefs[segment]
        : `/${segments.slice(0, index + 1).join('/')}/`,
    );
    const isCurrent = index === segments.length - 1;
    const title =
      isCurrent && typeof page.value.title === 'string'
        ? page.value.title
        : (sectionLabels[segment] ?? segment);

    return { href, isCurrent, title };
  });
});
</script>

<template>
  <nav v-if="breadcrumbs.length" aria-label="面包屑" class="pl-breadcrumbs">
    <a :href="withBase('/')">首页</a>
    <template v-for="item in breadcrumbs" :key="item.href">
      <span aria-hidden="true">/</span>
      <span v-if="item.isCurrent" aria-current="page">{{ item.title }}</span>
      <a v-else :href="item.href">{{ item.title }}</a>
    </template>
  </nav>
</template>
