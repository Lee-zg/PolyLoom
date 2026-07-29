import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import vue from '@astrojs/vue';
import { defineConfig } from 'astro/config';

const docsBase = process.env.DOCS_BASE ?? '/';
const siteUrl = process.env.SITE_URL;

export default defineConfig({
  base: docsBase,
  output: 'static',
  site: siteUrl,
  integrations: [
    starlight({
      customCss: ['./src/styles/custom.css'],
      defaultLocale: 'root',
      description: '可组合、可追溯、按需发布的个人前端组件与插件库。',
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN',
        },
      },
      sidebar: [
        {
          label: '开始',
          items: [
            { label: '设计与安装', slug: 'guides/getting-started' },
            { label: '导入策略', slug: 'guides/imports' },
            { label: '历史代码准入', slug: 'guides/governance' },
            { label: '发布流程', slug: 'guides/releasing' },
          ],
        },
        {
          label: '组件',
          items: [
            { label: 'Button', slug: 'components/button' },
            { label: 'EmbedPdfVue', slug: 'components/embedpdf-vue' },
          ],
        },
        {
          label: '插件',
          items: [{ label: 'EventBus', slug: 'plugins/event-bus' }],
        },
      ],
      social: [],
      title: 'PolyLoom',
    }),
    vue(),
    react(),
  ],
});
