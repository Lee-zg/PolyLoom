import { resolve } from 'node:path';
import { defineConfig } from 'vitepress';

const DEFAULT_PRODUCTION_BASE = '/PolyLoom/';
const SITE_ORIGIN = process.env.SITE_URL ?? 'https://lee-zg.github.io';

/**
 * VitePress 要求 base 首尾都带斜杠；在配置入口统一处理可避免资源地址和 canonical 分叉。
 */
function normalizeBase(rawBase: string | undefined) {
  if (!rawBase || rawBase === '/') {
    return '/';
  }

  return `/${rawBase.replace(/^\/+|\/+$/g, '')}/`;
}

const base = normalizeBase(
  process.env.DOCS_BASE ?? (process.env.GITHUB_ACTIONS ? DEFAULT_PRODUCTION_BASE : '/'),
);
const publicSiteBase = normalizeBase(process.env.DOCS_BASE ?? DEFAULT_PRODUCTION_BASE);
const siteUrl = new URL(publicSiteBase, `${SITE_ORIGIN.replace(/\/+$/, '')}/`).href;
const repositoryUrl = 'https://github.com/Lee-zg/PolyLoom';

/**
 * 中文无天然空格，借助原生分词器同时保留英文和代码标识符。
 * 不支持 Intl.Segmenter 的构建环境会回退到稳定的中英文词元拆分。
 */
function tokenizeSearchText(text: string) {
  // 该函数会序列化到浏览器搜索运行时，不能引用配置模块的闭包变量。
  const chineseSegmenter =
    typeof Intl.Segmenter === 'function'
      ? new Intl.Segmenter('zh-CN', { granularity: 'word' })
      : undefined;

  if (chineseSegmenter) {
    return [...chineseSegmenter.segment(text)]
      .map(({ segment }) => segment.trim().toLowerCase())
      .filter(Boolean);
  }

  return text.toLowerCase().match(/[\p{Script=Han}]+|[\p{Letter}\p{Number}_@./-]+/gu) ?? [];
}

export default defineConfig({
  base,
  cleanUrls: true,
  description: '可组合、可追溯、按需发布的个人多框架前端组件与插件库。',
  head: [
    ['link', { href: `${base}favicon.svg`, rel: 'icon', type: 'image/svg+xml' }],
    ['meta', { content: '#c77816', name: 'theme-color' }],
    ['meta', { content: 'website', property: 'og:type' }],
    ['meta', { content: 'summary_large_image', name: 'twitter:card' }],
  ],
  ignoreDeadLinks: false,
  lang: 'zh-CN',
  lastUpdated: true,
  markdown: {
    theme: {
      dark: 'github-dark-high-contrast',
      light: 'github-light-high-contrast',
    },
  },
  outDir: 'dist',
  sitemap: {
    hostname: siteUrl,
  },
  srcExclude: ['src/**'],
  title: 'PolyLoom',
  titleTemplate: ':title · PolyLoom',
  transformPageData(pageData) {
    const relativePath = pageData.relativePath.replace(/(^|\/)index\.md$/, '$1');
    const canonicalPath = relativePath.replace(/\.md$/, '');
    const canonicalUrl = new URL(canonicalPath, siteUrl).href;
    const pageTitle = pageData.frontmatter.title
      ? `${String(pageData.frontmatter.title)} · PolyLoom`
      : 'PolyLoom';
    const pageDescription =
      pageData.frontmatter.description ?? '可组合、可追溯、按需发布的个人多框架前端组件与插件库。';

    pageData.frontmatter.head ??= [];
    pageData.frontmatter.head.push(
      ['link', { href: canonicalUrl, rel: 'canonical' }],
      ['meta', { content: pageTitle, property: 'og:title' }],
      ['meta', { content: pageDescription, property: 'og:description' }],
      ['meta', { content: canonicalUrl, property: 'og:url' }],
    );
  },
  themeConfig: {
    darkModeSwitchLabel: '切换深浅主题',
    darkModeSwitchTitle: '切换深浅主题',
    docFooter: {
      next: '下一页',
      prev: '上一页',
    },
    editLink: {
      pattern: `${repositoryUrl}/edit/main/apps/docs/:path`,
      text: '在 GitHub 上编辑此页',
    },
    footer: {
      copyright: 'Copyright © 2026 Lee-zg',
      message: '以 MIT 许可证发布 · 不加载分析脚本、外部字体或第三方 CDN',
    },
    lastUpdated: {
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short',
      },
      text: '最后更新',
    },
    logo: '/logo.svg',
    nav: [
      { link: '/guides/getting-started/', text: '指南' },
      { link: '/components/button/', text: '组件' },
      { link: '/plugins/event-bus/', text: '插件' },
      { link: '/packages/overview/', text: '包' },
      { link: '/maintainers/contributing/', text: '维护' },
      {
        items: [
          { link: '/en/', text: 'Overview' },
          { link: '/en/quick-start/', text: 'Quick Start' },
          { link: '/en/imports/', text: 'Import Matrix' },
        ],
        text: 'English',
      },
    ],
    notFound: {
      code: '404',
      linkLabel: '返回首页',
      quote: '这根线没有接入织网。请检查地址，或从文档首页重新开始。',
      title: '页面未找到',
    },
    outline: {
      label: '本页目录',
      level: [2, 4],
    },
    returnToTopLabel: '返回顶部',
    search: {
      options: {
        detailedView: true,
        locales: {
          root: {
            translations: {
              button: {
                buttonAriaLabel: '搜索文档',
                buttonText: '搜索',
              },
              modal: {
                backButtonTitle: '关闭搜索',
                displayDetails: '显示详细列表',
                footer: {
                  closeKeyAriaLabel: '关闭',
                  closeText: '关闭',
                  navigateDownKeyAriaLabel: '选择下一项',
                  navigateText: '切换',
                  navigateUpKeyAriaLabel: '选择上一项',
                  selectKeyAriaLabel: '打开所选项',
                  selectText: '打开',
                },
                noResultsText: '没有找到相关内容',
                resetButtonTitle: '清空搜索',
              },
            },
          },
        },
        miniSearch: {
          options: {
            tokenize: tokenizeSearchText,
          },
          searchOptions: {
            fuzzy: 0.15,
            prefix: true,
          },
        },
      },
      provider: 'local',
    },
    sidebar: {
      '/components/': [
        {
          items: [
            { link: '/components/button/', text: 'Button 按钮' },
            { link: '/components/embedpdf-vue/', text: 'EmbedPdfVue PDF 工作台' },
          ],
          text: '组件',
        },
        {
          items: [
            { link: '/guides/imports/', text: '导入策略' },
            { link: '/guides/theme/', text: '主题与样式' },
            { link: '/guides/compatibility/', text: '兼容性与 SSR' },
          ],
          text: '相关指南',
        },
      ],
      '/en/': [
        {
          items: [
            { link: '/en/', text: 'Overview' },
            { link: '/en/quick-start/', text: 'Quick Start' },
            { link: '/en/imports/', text: 'Import Matrix' },
          ],
          text: 'English',
        },
      ],
      '/guides/': [
        {
          items: [
            { link: '/guides/getting-started/', text: '项目介绍' },
            { link: '/guides/quick-start/', text: '五分钟快速开始' },
            { link: '/guides/imports/', text: '导入策略' },
            { link: '/guides/theme/', text: '主题与样式' },
            { link: '/guides/compatibility/', text: '兼容性与 SSR' },
            { link: '/guides/faq/', text: 'FAQ 与故障排查' },
          ],
          text: '使用指南',
        },
        {
          items: [
            { link: '/guides/governance/', text: '历史代码准入' },
            { link: '/guides/releasing/', text: '发布流程' },
          ],
          text: '保留入口',
        },
      ],
      '/maintainers/': [
        {
          items: [
            { link: '/maintainers/contributing/', text: '贡献指南' },
            { link: '/maintainers/governance/', text: '历史代码准入' },
            { link: '/maintainers/generator/', text: '生成器' },
            { link: '/maintainers/testing/', text: '测试矩阵' },
            { link: '/maintainers/releasing/', text: '版本与发布' },
            { link: '/maintainers/security/', text: '安全政策' },
            { link: '/maintainers/licenses/', text: '许可证与第三方声明' },
            { link: '/maintainers/changelog/', text: 'Changelog' },
          ],
          text: '维护者手册',
        },
      ],
      '/packages/': [
        {
          items: [
            { link: '/packages/overview/', text: '包总览' },
            { link: '/packages/core/', text: '@polyloom/core' },
            { link: '/packages/theme/', text: '@polyloom/theme' },
            { link: '/packages/plugins/', text: '@polyloom/plugins' },
            { link: '/packages/vue/', text: '@polyloom/vue' },
            { link: '/packages/react/', text: '@polyloom/react' },
            { link: '/packages/polyloom/', text: 'polyloom' },
          ],
          text: '公开包',
        },
      ],
      '/plugins/': [
        {
          items: [{ link: '/plugins/event-bus/', text: 'EventBus 事件总线' }],
          text: '插件',
        },
        {
          items: [
            { link: '/guides/imports/', text: '导入策略' },
            { link: '/packages/plugins/', text: '插件包说明' },
          ],
          text: '相关指南',
        },
      ],
    },
    sidebarMenuLabel: '文档导航',
    siteTitle: 'PolyLoom',
    socialLinks: [
      { icon: 'github', link: repositoryUrl },
      { icon: 'npm', link: 'https://www.npmjs.com/package/polyloom' },
    ],
  },
  vite: {
    resolve: {
      alias: [
        {
          find: /^@polyloom\/core\/button$/,
          replacement: resolve(import.meta.dirname, '../../../packages/core/src/button/index.ts'),
        },
        {
          find: /^@polyloom\/vue\/button$/,
          replacement: resolve(import.meta.dirname, '../../../packages/vue/src/button/index.ts'),
        },
        {
          find: /^@polyloom\/react\/button$/,
          replacement: resolve(import.meta.dirname, '../../../packages/react/src/button/index.ts'),
        },
        {
          find: /^@polyloom\/vue\/embedpdf-vue$/,
          replacement: resolve(
            import.meta.dirname,
            '../../../packages/vue/src/embedpdf-vue/index.ts',
          ),
        },
      ],
    },
  },
});
