import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, onMounted } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import EmbedPdfVue from './EmbedPdfVue.vue';

enableAutoUnmount(afterEach);

const runtimeMocks = vi.hoisted(() => ({
  activeDocumentId: null as string | null,
  configSnapshots: [] as Array<Record<string, unknown>>,
  documentErrorListener: null as ((event: unknown) => void) | null,
  documentOpenedListener: null as
    ((event: { document: { pageCount: number }; id: string }) => void) | null,
  emitReady: true,
  layoutListener: null as
    | ((event: {
        documentId: string;
        isInitial: boolean;
        pageNumber: number;
        totalPages: number;
      }) => void)
    | null,
  loadRuntime: vi.fn(),
  pageCount: 0,
  scrollToPage: vi.fn(),
  stateListener: null as ((state: { totalPages: number }) => void) | null,
  unsubscribeCallbacks: [] as Array<ReturnType<typeof vi.fn>>,
}));

vi.mock('./runtime.js', () => ({
  loadEmbedPdfVueRuntime: runtimeMocks.loadRuntime,
}));

const MockPdfViewer = defineComponent({
  name: 'MockPdfViewer',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  emits: ['init', 'ready'],
  setup(mockProps, { emit }) {
    onMounted(() => {
      runtimeMocks.configSnapshots.push(mockProps.config);
      emit('init', mockContainer);
      if (runtimeMocks.emitReady) emit('ready', mockRegistry);
    });
    return () => h('div', { 'data-testid': 'mock-pdf-viewer' });
  },
});

const documentManagerCapability = {
  getActiveDocumentId: vi.fn(() => runtimeMocks.activeDocumentId),
  onDocumentError: vi.fn((listener: (event: unknown) => void) => {
    runtimeMocks.documentErrorListener = listener;
    const unsubscribe = vi.fn();
    runtimeMocks.unsubscribeCallbacks.push(unsubscribe);
    return unsubscribe;
  }),
  onDocumentOpened: vi.fn(
    (listener: (event: { document: { pageCount: number }; id: string }) => void) => {
      runtimeMocks.documentOpenedListener = listener;
      const unsubscribe = vi.fn();
      runtimeMocks.unsubscribeCallbacks.push(unsubscribe);
      return unsubscribe;
    },
  ),
};

const documentScroll = {
  getTotalPages: vi.fn(() => runtimeMocks.pageCount),
  scrollToPage: runtimeMocks.scrollToPage,
};

const scrollCapability = {
  forDocument: vi.fn(() => documentScroll),
  onLayoutReady: vi.fn(
    (
      listener: (event: {
        documentId: string;
        isInitial: boolean;
        pageNumber: number;
        totalPages: number;
      }) => void,
    ) => {
      runtimeMocks.layoutListener = listener;
      const unsubscribe = vi.fn();
      runtimeMocks.unsubscribeCallbacks.push(unsubscribe);
      return unsubscribe;
    },
  ),
  onStateChange: vi.fn((listener: (state: { totalPages: number }) => void) => {
    runtimeMocks.stateListener = listener;
    const unsubscribe = vi.fn();
    runtimeMocks.unsubscribeCallbacks.push(unsubscribe);
    return unsubscribe;
  }),
};

const mockRegistry = {
  getPlugin: vi.fn((pluginId: string) => {
    if (pluginId === 'document-manager') {
      return { provides: () => documentManagerCapability };
    }
    if (pluginId === 'scroll') {
      return { provides: () => scrollCapability };
    }
    return null;
  }),
};

const mockContainerElement = document.createElement('embedpdf-container');
const mockShadowRoot = mockContainerElement.attachShadow({ mode: 'open' });
const mockContainer = Object.assign(mockContainerElement, {
  registry: Promise.resolve(mockRegistry),
});

beforeEach(() => {
  runtimeMocks.activeDocumentId = null;
  runtimeMocks.configSnapshots.length = 0;
  runtimeMocks.documentErrorListener = null;
  runtimeMocks.documentOpenedListener = null;
  runtimeMocks.emitReady = true;
  runtimeMocks.layoutListener = null;
  runtimeMocks.loadRuntime.mockReset();
  runtimeMocks.loadRuntime.mockResolvedValue({ PDFViewer: MockPdfViewer });
  runtimeMocks.pageCount = 0;
  runtimeMocks.scrollToPage.mockReset();
  runtimeMocks.stateListener = null;
  runtimeMocks.unsubscribeCallbacks.length = 0;
  mockContainer.registry = Promise.resolve(mockRegistry);
  mockShadowRoot.replaceChildren();
  documentManagerCapability.getActiveDocumentId.mockClear();
  documentManagerCapability.onDocumentError.mockClear();
  documentManagerCapability.onDocumentOpened.mockClear();
  documentScroll.getTotalPages.mockClear();
  scrollCapability.forDocument.mockClear();
  scrollCapability.onLayoutReady.mockClear();
  scrollCapability.onStateChange.mockClear();
  mockRegistry.getPlugin.mockClear();
});

describe('EmbedPdfVue', () => {
  it('挂载后动态加载运行时，并让明确属性覆盖 viewerConfig', async () => {
    const wrapper = mount(EmbedPdfVue, {
      props: {
        defaultZoom: 1.25,
        initialPage: 99,
        src: '/fixtures/guide.pdf',
        viewerConfig: {
          worker: false,
          zoom: {
            defaultZoomLevel: 0.5,
            maxZoom: 3,
          },
        },
        wasmUrl: '/assets/pdfium.wasm',
      },
    });

    await flushPromises();

    expect(runtimeMocks.loadRuntime).toHaveBeenCalledOnce();
    expect(runtimeMocks.configSnapshots[0]).toMatchObject({
      src: '/fixtures/guide.pdf',
      wasmUrl: '/assets/pdfium.wasm',
      worker: false,
      zoom: {
        defaultZoomLevel: 1.25,
        maxZoom: 3,
      },
    });
    expect(wrapper.emitted('init')?.[0]?.[0]).toBe(mockContainer);
    expect(wrapper.emitted('ready')?.[0]?.[0]).toBe(mockRegistry);

    runtimeMocks.stateListener?.({ totalPages: 3 });
    runtimeMocks.layoutListener?.({
      documentId: 'guide',
      isInitial: true,
      pageNumber: 1,
      totalPages: 3,
    });
    await wrapper.vm.$nextTick();

    expect(runtimeMocks.scrollToPage).toHaveBeenCalledWith({
      behavior: 'instant',
      pageNumber: 3,
    });
    expect(wrapper.emitted('load')?.[0]?.[0]).toEqual({
      documentId: 'guide',
      pageCount: 3,
      src: '/fixtures/guide.pdf',
    });
    expect(wrapper.attributes('aria-busy')).toBe('false');

    runtimeMocks.layoutListener?.({
      documentId: 'guide',
      isInitial: false,
      pageNumber: 3,
      totalPages: 3,
    });
    expect(runtimeMocks.scrollToPage).toHaveBeenCalledOnce();
    expect(wrapper.emitted('load')).toHaveLength(1);
  });

  it('ready 前已经完成布局时仍会跳转并发出 load', async () => {
    runtimeMocks.activeDocumentId = 'ready-before-subscribe';
    runtimeMocks.pageCount = 2;

    const wrapper = mount(EmbedPdfVue, {
      props: {
        initialPage: 0,
        src: '/ready.pdf',
      },
    });
    await flushPromises();

    expect(runtimeMocks.scrollToPage).toHaveBeenCalledWith({
      behavior: 'instant',
      pageNumber: 1,
    });
    expect(wrapper.emitted('load')).toHaveLength(1);
  });

  it('registry 建立后才完成文档加载时仍会跳转并发出 load', async () => {
    const wrapper = mount(EmbedPdfVue, {
      props: {
        initialPage: 9,
        src: '/late-document.pdf',
      },
    });
    await flushPromises();

    runtimeMocks.documentOpenedListener?.({
      document: { pageCount: 0 },
      id: 'empty-document',
    });
    runtimeMocks.activeDocumentId = 'late-document';
    runtimeMocks.documentOpenedListener?.({
      document: { pageCount: 4 },
      id: 'late-document',
    });
    await flushPromises();

    expect(runtimeMocks.scrollToPage).toHaveBeenCalledWith({
      behavior: 'instant',
      pageNumber: 4,
    });
    expect(wrapper.emitted('load')?.[0]?.[0]).toEqual({
      documentId: 'late-document',
      pageCount: 4,
      src: '/late-document.pdf',
    });
  });

  it('补强官方 Shadow DOM 中动态控件的无障碍属性', async () => {
    mockShadowRoot.innerHTML = `
      <input type="text" inputmode="numeric">
      <div class="bg-bg-app" style="overflow: auto"></div>
      <button aria-label="下一页"><svg role="img"></svg></button>
      <img src="blob:fixture">
    `;

    mount(EmbedPdfVue, {
      props: { src: '/accessible.pdf' },
    });
    await flushPromises();

    expect(mockShadowRoot.querySelector('input')?.getAttribute('aria-label')).toBe('当前页码');
    expect(mockShadowRoot.querySelector('.bg-bg-app')).toMatchObject({
      ariaLabel: 'PDF 文档画布',
      role: 'region',
      tabIndex: 0,
    });
    expect(mockShadowRoot.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    expect(mockShadowRoot.querySelector('img')).toMatchObject({
      alt: '',
      role: 'presentation',
    });

    const dynamicInput = document.createElement('input');
    dynamicInput.type = 'text';
    dynamicInput.inputMode = 'numeric';
    mockShadowRoot.append(dynamicInput);
    await flushPromises();
    expect(dynamicInput.getAttribute('aria-label')).toBe('当前页码');
  });

  it('registry 缺少必需插件时报告初始化错误', async () => {
    mockRegistry.getPlugin.mockReturnValueOnce(null);

    const wrapper = mount(EmbedPdfVue, {
      props: { src: '/missing-plugin.pdf' },
    });
    await flushPromises();

    expect(wrapper.emitted('error')?.[0]?.[0]).toMatchObject({
      phase: 'viewer-init',
      src: '/missing-plugin.pdf',
    });
    expect(wrapper.text()).toContain('PDF 引擎初始化失败');
  });

  it('registry Promise 拒绝时报告初始化错误', async () => {
    const registryError = new Error('registry unavailable');
    runtimeMocks.emitReady = false;
    mockContainer.registry = Promise.reject(registryError);

    const wrapper = mount(EmbedPdfVue, {
      props: { src: '/registry-error.pdf' },
    });
    await flushPromises();

    expect(wrapper.emitted('error')?.[0]?.[0]).toEqual({
      cause: registryError,
      phase: 'viewer-init',
      src: '/registry-error.pdf',
    });
  });

  it('src 更新时取消旧订阅并重新挂载查看器', async () => {
    const wrapper = mount(EmbedPdfVue, {
      props: { src: '/first.pdf' },
    });
    await flushPromises();

    const previousSubscriptions = [...runtimeMocks.unsubscribeCallbacks];
    await wrapper.setProps({ src: '/second.pdf' });
    await flushPromises();

    expect(previousSubscriptions).toHaveLength(4);
    for (const unsubscribe of previousSubscriptions) {
      expect(unsubscribe).toHaveBeenCalledOnce();
    }
    expect(runtimeMocks.loadRuntime).toHaveBeenCalledTimes(2);
    expect(runtimeMocks.configSnapshots.at(-1)).toMatchObject({ src: '/second.pdf' });
  });

  it('文档错误进入可重试状态并保留原始错误', async () => {
    const wrapper = mount(EmbedPdfVue, {
      props: { src: '/broken.pdf' },
    });
    await flushPromises();

    const cause = { message: 'invalid cross-reference table' };
    runtimeMocks.documentErrorListener?.(cause);
    await wrapper.vm.$nextTick();

    expect(wrapper.get('[role="alert"]').text()).toContain('无法显示这份文档');
    expect(wrapper.emitted('error')?.[0]?.[0]).toEqual({
      cause,
      phase: 'document-load',
      src: '/broken.pdf',
    });

    await wrapper.get('button').trigger('click');
    await flushPromises();
    expect(runtimeMocks.loadRuntime).toHaveBeenCalledTimes(2);
  });

  it('运行时导入失败时提供可重试错误', async () => {
    const importError = new Error('chunk unavailable');
    runtimeMocks.loadRuntime.mockRejectedValueOnce(importError);

    const wrapper = mount(EmbedPdfVue, {
      props: { src: '/document.pdf' },
    });
    await flushPromises();

    expect(wrapper.emitted('error')?.[0]?.[0]).toEqual({
      cause: importError,
      phase: 'component-import',
      src: '/document.pdf',
    });
    expect(wrapper.text()).toContain('查看器运行时加载失败');
  });

  it('iframe 模式保留原生加载、错误和安全外部链接', async () => {
    const wrapper = mount(EmbedPdfVue, {
      props: {
        previewType: 'iframe',
        src: '/native.pdf',
        title: '',
      },
    });
    await flushPromises();

    expect(runtimeMocks.loadRuntime).not.toHaveBeenCalled();
    expect(wrapper.find('header').exists()).toBe(false);
    expect(wrapper.get('iframe').attributes('title')).toBe('PDF 文档');

    await wrapper.get('iframe').trigger('load');
    expect(wrapper.emitted('load')?.[0]?.[0]).toEqual({ src: '/native.pdf' });

    await wrapper.get('iframe').trigger('error');
    expect(wrapper.emitted('error')?.[0]?.[0]).toMatchObject({
      phase: 'iframe-load',
      src: '/native.pdf',
    });
    expect(wrapper.get('[role="alert"] a').attributes('rel')).toBe('noopener noreferrer');
  });

  it('空 src 立即报告错误，暴露 reload、container 与 registry', async () => {
    const wrapper = mount(EmbedPdfVue, {
      props: { src: '   ' },
    });
    await flushPromises();

    expect(runtimeMocks.loadRuntime).not.toHaveBeenCalled();
    expect(wrapper.emitted('error')?.[0]?.[0]).toMatchObject({
      phase: 'document-load',
      src: '   ',
    });

    const exposed = wrapper.vm as unknown as {
      container: unknown;
      registry: unknown;
      reload: () => Promise<void>;
    };
    expect(exposed.container).toBeNull();
    expect(exposed.registry).toBeNull();
    await exposed.reload();
    expect(wrapper.emitted('error')).toHaveLength(2);
  });

  it('卸载时清理全部 registry 订阅', async () => {
    const wrapper = mount(EmbedPdfVue, {
      props: { src: '/cleanup.pdf' },
    });
    await flushPromises();

    const subscriptions = [...runtimeMocks.unsubscribeCallbacks];
    wrapper.unmount();

    for (const unsubscribe of subscriptions) {
      expect(unsubscribe).toHaveBeenCalledOnce();
    }
  });
});
