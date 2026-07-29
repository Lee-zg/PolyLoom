<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  useAttrs,
  watch,
  type Component,
  type CSSProperties,
} from 'vue';
import type {
  DocumentManagerPlugin,
  EmbedPdfContainer as OfficialEmbedPdfContainer,
  PDFViewerConfig as OfficialPDFViewerConfig,
  PluginRegistry as OfficialPluginRegistry,
  ScrollPlugin,
} from '@embedpdf/vue-pdf-viewer';
import type {
  EmbedPdfContainer,
  EmbedPdfVueError,
  EmbedPdfVueExpose,
  EmbedPdfVueLoadEvent,
  EmbedPdfVueProps,
  PluginRegistry,
} from './types.js';
import { loadEmbedPdfVueRuntime } from './runtime.js';

defineOptions({
  name: 'PlEmbedPdfVue',
  inheritAttrs: false,
});

const DEFAULT_TITLE = 'PDF 文档';
const DEFAULT_HEIGHT = '80vh';
const DEFAULT_ZOOM_LEVEL = 'fit-width';
const FIRST_PAGE = 1;
const DOCUMENT_MANAGER_PLUGIN_ID = 'document-manager';
const SCROLL_PLUGIN_ID = 'scroll';

const props = withDefaults(defineProps<EmbedPdfVueProps>(), {
  defaultZoom: DEFAULT_ZOOM_LEVEL,
  height: DEFAULT_HEIGHT,
  initialPage: FIRST_PAGE,
  previewType: 'default',
  title: DEFAULT_TITLE,
});

const emit = defineEmits<{
  init: [container: EmbedPdfContainer];
  ready: [registry: PluginRegistry];
  load: [event: EmbedPdfVueLoadEvent];
  error: [event: EmbedPdfVueError];
}>();

const attrs = useAttrs();
const isClient = ref(false);
const isLoading = ref(true);
const reloadKey = ref(0);
const viewerComponent = shallowRef<Component | null>(null);
const viewerContainer = shallowRef<OfficialEmbedPdfContainer | null>(null);
const viewerRegistry = shallowRef<OfficialPluginRegistry | null>(null);
const failure = shallowRef<EmbedPdfVueError | null>(null);

let activeReload = 0;
let emittedDocumentId: string | null = null;
let navigatedDocumentId: string | null = null;
let cleanupSubscriptions: Array<() => void> = [];

const viewerConfig = computed<OfficialPDFViewerConfig>(
  () =>
    ({
      ...props.viewerConfig,
      src: props.src.trim(),
      ...(props.wasmUrl === undefined ? {} : { wasmUrl: props.wasmUrl }),
      zoom: {
        ...props.viewerConfig?.zoom,
        defaultZoomLevel: props.defaultZoom,
      },
    }) as OfficialPDFViewerConfig,
);

const rootStyle = computed<CSSProperties>(
  () =>
    ({
      '--pl-embedpdf-vue-height': props.height,
    }) as CSSProperties,
);

const rootAttributes = computed(() => {
  const restAttributes = { ...attrs };
  delete restAttributes.class;
  delete restAttributes.style;
  return restAttributes;
});
const rootClasses = computed(() => ['pl-embedpdf-vue', attrs.class]);
const rootStyles = computed(() => [rootStyle.value, attrs.style]);

const statusText = computed(() => {
  if (failure.value) return 'PDF 加载失败';
  if (isLoading.value) return props.previewType === 'iframe' ? '等待浏览器预览' : '正在准备 PDF';
  return props.previewType === 'iframe' ? '浏览器预览已就绪' : 'PDF 已就绪';
});

const errorDescription = computed(() => {
  switch (failure.value?.phase) {
    case 'component-import':
      return '查看器运行时加载失败，请检查网络、打包配置后重试。';
    case 'viewer-init':
      return 'PDF 引擎初始化失败，请检查 WASM 地址与内容安全策略。';
    case 'iframe-load':
      return '浏览器未能加载此 PDF，可尝试在新窗口中打开。';
    default:
      return '文档无法解析或读取，请检查文件地址、CORS 与访问权限。';
  }
});

function clearSubscriptions() {
  for (const unsubscribe of cleanupSubscriptions.splice(0)) unsubscribe();
}

function enhanceViewerAccessibility(container: OfficialEmbedPdfContainer | null) {
  const shadowRoot = container?.shadowRoot;
  if (!shadowRoot) return;

  const applyAccessibilityAttributes = () => {
    for (const input of shadowRoot.querySelectorAll<HTMLInputElement>(
      'input[type="text"][inputmode="numeric"]:not([aria-label])',
    )) {
      input.setAttribute('aria-label', '当前页码');
    }
    for (const canvas of shadowRoot.querySelectorAll<HTMLElement>(
      'div.bg-bg-app[style*="overflow: auto"]',
    )) {
      canvas.setAttribute('aria-label', 'PDF 文档画布');
      canvas.setAttribute('role', 'region');
      canvas.setAttribute('tabindex', '0');
    }
    for (const icon of shadowRoot.querySelectorAll<SVGElement>(
      'svg[role="img"]:not([aria-label]):not([aria-labelledby])',
    )) {
      // 官方 UI 的 SVG 均作为控件图标；未命名图标不应被辅助技术当成独立图片。
      icon.setAttribute('aria-hidden', 'true');
    }
    for (const pageImage of shadowRoot.querySelectorAll<HTMLImageElement>('img:not([alt])')) {
      // PDF 页面位图只是 region 内的视觉渲染结果，空替代文本可避免读屏重复播报无意义的 blob URL。
      pageImage.alt = '';
      pageImage.setAttribute('role', 'presentation');
    }
  };

  applyAccessibilityAttributes();
  const observer = new MutationObserver(applyAccessibilityAttributes);
  observer.observe(shadowRoot, { childList: true, subtree: true });
  cleanupSubscriptions.push(() => observer.disconnect());
}

function resetState() {
  clearSubscriptions();
  isLoading.value = true;
  failure.value = null;
  viewerContainer.value = null;
  viewerRegistry.value = null;
  emittedDocumentId = null;
  navigatedDocumentId = null;
}

function reportFailure(phase: EmbedPdfVueError['phase'], cause: unknown) {
  const event: EmbedPdfVueError = { cause, phase, src: props.src };
  isLoading.value = false;
  failure.value = event;
  emit('error', event);
}

function clampInitialPage(totalPages: number) {
  const requestedPage = Number.isFinite(props.initialPage)
    ? Math.trunc(props.initialPage)
    : FIRST_PAGE;
  return Math.min(Math.max(requestedPage, FIRST_PAGE), Math.max(totalPages, FIRST_PAGE));
}

function emitDocumentLoaded(documentId: string, pageCount?: number) {
  if (emittedDocumentId === documentId) return;
  emittedDocumentId = documentId;
  isLoading.value = false;
  emit('load', {
    documentId,
    src: props.src,
    ...(pageCount === undefined ? {} : { pageCount }),
  });
}

function completeDocumentLayout(
  scroll: Readonly<ReturnType<ScrollPlugin['provides']>>,
  documentId: string,
  pageCount: number,
) {
  if (pageCount <= 0) return;

  if (navigatedDocumentId !== documentId) {
    // scrollToPage 会同步触发状态事件，先登记可避免状态回调重入。
    navigatedDocumentId = documentId;
    scroll.forDocument(documentId).scrollToPage({
      behavior: 'instant',
      pageNumber: clampInitialPage(pageCount),
    });
  }
  emitDocumentLoaded(documentId, pageCount);
}

function connectRegistry(registry: OfficialPluginRegistry) {
  clearSubscriptions();
  enhanceViewerAccessibility(viewerContainer.value);
  const documentManager = registry
    .getPlugin<DocumentManagerPlugin>(DOCUMENT_MANAGER_PLUGIN_ID)
    ?.provides();
  const scroll = registry.getPlugin<ScrollPlugin>(SCROLL_PLUGIN_ID)?.provides();

  if (!documentManager || !scroll) {
    reportFailure(
      'viewer-init',
      new Error('EmbedPDF registry 中缺少 document-manager 或 scroll 插件。'),
    );
    return;
  }

  cleanupSubscriptions.push(
    documentManager.onDocumentOpened((documentState) => {
      failure.value = null;
      isLoading.value = true;

      const pageCount = documentState.document?.pageCount;
      if (pageCount) {
        // registry 可能晚于小型文档就绪；以文档事件补偿布局事件的竞态窗口。
        void nextTick(() => completeDocumentLayout(scroll, documentState.id, pageCount));
      }
    }),
    documentManager.onDocumentError((documentError) => {
      reportFailure('document-load', documentError);
    }),
    scroll.onLayoutReady((layout) => {
      // 页面布局确定后才能可靠地限制页码并跳转，否则大文档可能回落到第 1 页。
      completeDocumentLayout(scroll, layout.documentId, layout.totalPages);
    }),
    scroll.onStateChange((scrollState) => {
      // 极小文档可能在 registry ready 转发前完成 layout，状态流用于补偿这段竞态窗口。
      const activeDocumentId = documentManager.getActiveDocumentId();
      if (activeDocumentId) {
        completeDocumentLayout(scroll, activeDocumentId, scrollState.totalPages);
      }
    }),
  );

  // 小型文档可能在 Vue ready 事件前完成首次布局，主动读取当前状态避免漏发 load。
  const activeDocumentId = documentManager.getActiveDocumentId();
  if (activeDocumentId) {
    const documentScroll = scroll.forDocument(activeDocumentId);
    const pageCount = documentScroll.getTotalPages();
    completeDocumentLayout(scroll, activeDocumentId, pageCount);
  }
}

function handleViewerInit(container: OfficialEmbedPdfContainer) {
  viewerContainer.value = container;
  emit('init', container as unknown as EmbedPdfContainer);

  const reloadAtInit = activeReload;
  void container.registry
    .then((registry) => {
      if (reloadAtInit !== activeReload || viewerRegistry.value === registry) return;
      viewerRegistry.value = registry;
      connectRegistry(registry);
    })
    .catch((cause) => {
      if (reloadAtInit === activeReload) reportFailure('viewer-init', cause);
    });
}

function handleViewerReady(registry: OfficialPluginRegistry) {
  const alreadyConnected = viewerRegistry.value === registry;
  viewerRegistry.value = registry;
  emit('ready', registry as unknown as PluginRegistry);
  if (!alreadyConnected) connectRegistry(registry);
}

function handleIframeLoad() {
  isLoading.value = false;
  failure.value = null;
  emit('load', { src: props.src });
}

function handleIframeError(event: Event) {
  reportFailure('iframe-load', event);
}

/** 清理旧实例并重新装载当前文档。 */
async function reload() {
  const requestedReload = ++activeReload;
  resetState();
  viewerComponent.value = null;
  reloadKey.value += 1;

  if (!isClient.value) return;
  if (!props.src.trim()) {
    reportFailure('document-load', new TypeError('src 不能为空。'));
    return;
  }
  if (props.previewType === 'iframe') {
    await nextTick();
    return;
  }

  try {
    // 浏览器运行时只在挂载后加载，确保包入口和 SSR 渲染都不访问 DOM 全局对象。
    const runtime = await loadEmbedPdfVueRuntime();
    if (requestedReload !== activeReload) return;
    viewerComponent.value = runtime.PDFViewer;
    await nextTick();
  } catch (cause) {
    if (requestedReload === activeReload) reportFailure('component-import', cause);
  }
}

const exposedApi: EmbedPdfVueExpose = {
  reload,
  get container() {
    return viewerContainer.value as unknown as EmbedPdfContainer | null;
  },
  get registry() {
    return viewerRegistry.value as unknown as PluginRegistry | null;
  },
};
defineExpose(exposedApi);

watch(
  () => [
    props.src,
    props.previewType,
    props.defaultZoom,
    props.initialPage,
    props.wasmUrl,
    props.viewerConfig,
  ],
  () => {
    if (isClient.value) void reload();
  },
  { deep: true },
);

onMounted(() => {
  isClient.value = true;
  void reload();
});

onBeforeUnmount(() => {
  activeReload += 1;
  clearSubscriptions();
});
</script>

<template>
  <section
    v-bind="rootAttributes"
    :aria-busy="isLoading ? 'true' : 'false'"
    :class="rootClasses"
    :style="rootStyles"
  >
    <header v-if="title" class="pl-embedpdf-vue__header">
      <div class="pl-embedpdf-vue__heading">
        <span aria-hidden="true" class="pl-embedpdf-vue__document-mark">PDF</span>
        <h2 class="pl-embedpdf-vue__title">{{ title }}</h2>
      </div>
      <div class="pl-embedpdf-vue__header-actions">
        <span class="pl-embedpdf-vue__mode">
          {{ previewType === 'iframe' ? '浏览器模式' : '工作台模式' }}
        </span>
        <a
          class="pl-embedpdf-vue__external-link"
          :href="src"
          rel="noopener noreferrer"
          target="_blank"
        >
          新窗口打开
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>

    <div class="pl-embedpdf-vue__viewport">
      <div v-if="failure" class="pl-embedpdf-vue__error" role="alert">
        <span aria-hidden="true" class="pl-embedpdf-vue__error-code">PDF / ERR</span>
        <h3>无法显示这份文档</h3>
        <p>{{ errorDescription }}</p>
        <div class="pl-embedpdf-vue__error-actions">
          <button type="button" @click="reload">重新加载</button>
          <a :href="src" rel="noopener noreferrer" target="_blank">外部打开</a>
        </div>
      </div>

      <template v-else>
        <iframe
          v-if="isClient && previewType === 'iframe'"
          :key="reloadKey"
          class="pl-embedpdf-vue__iframe"
          :src="src"
          :title="title || DEFAULT_TITLE"
          @error="handleIframeError"
          @load="handleIframeLoad"
        />
        <component
          :is="viewerComponent"
          v-else-if="isClient && viewerComponent"
          :key="reloadKey"
          class="pl-embedpdf-vue__viewer"
          :config="viewerConfig"
          @init="handleViewerInit"
          @ready="handleViewerReady"
        />

        <div v-if="isLoading" aria-live="polite" class="pl-embedpdf-vue__loading" role="status">
          <span aria-hidden="true" class="pl-embedpdf-vue__spinner" />
          <span>{{ statusText }}</span>
        </div>
      </template>
    </div>

    <footer class="pl-embedpdf-vue__status">
      <span aria-hidden="true" class="pl-embedpdf-vue__status-light" />
      <span>{{ statusText }}</span>
      <span class="pl-embedpdf-vue__status-hint">本地渲染 · PDFium</span>
    </footer>
  </section>
</template>
