/** EmbedPDF 支持的固定缩放模式或数值倍率。 */
export type ZoomLevel = 'automatic' | 'fit-page' | 'fit-width' | number;

/** 无需绑定上游内部类型即可透传的插件配置对象。 */
export type PDFViewerPluginConfig = Record<string, unknown>;

/** 查看器缩放配置的稳定公开子集，其余字段仍可按官方配置透传。 */
export interface PDFViewerZoomConfig extends PDFViewerPluginConfig {
  defaultZoomLevel?: ZoomLevel;
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
}

/** 查看器外部字体加载配置。 */
export interface PDFViewerFontsConfig {
  ui?: null | {
    family?: string;
    stylesheetUrl?: string | null;
  };
  signature?: null | {
    fonts?: Array<{ family: string; name: string }>;
    stylesheetUrl?: string | null;
  };
}

/**
 * EmbedPDF 2.x 查看器配置的稳定兼容门面。
 *
 * 使用宽松的插件配置对象隔离上游声明文件中的内部路径，同时保留所有官方配置入口。
 */
export interface PDFViewerConfig {
  src?: string;
  worker?: boolean;
  wasmUrl?: string;
  log?: boolean;
  fontFallback?: PDFViewerPluginConfig | null;
  permissions?: PDFViewerPluginConfig;
  theme?: PDFViewerPluginConfig;
  icons?: PDFViewerPluginConfig;
  tabBar?: 'always' | 'multiple' | 'never';
  disabledCategories?: string[];
  documentManager?: PDFViewerPluginConfig;
  commands?: PDFViewerPluginConfig;
  i18n?: PDFViewerPluginConfig;
  ui?: PDFViewerPluginConfig;
  form?: PDFViewerPluginConfig;
  viewport?: PDFViewerPluginConfig;
  scroll?: PDFViewerPluginConfig;
  zoom?: PDFViewerZoomConfig;
  spread?: PDFViewerPluginConfig;
  rotation?: PDFViewerPluginConfig;
  pan?: PDFViewerPluginConfig;
  render?: PDFViewerPluginConfig;
  tiling?: PDFViewerPluginConfig;
  thumbnails?: PDFViewerPluginConfig;
  annotations?: PDFViewerPluginConfig;
  search?: PDFViewerPluginConfig;
  selection?: PDFViewerPluginConfig;
  bookmarks?: PDFViewerPluginConfig;
  attachments?: PDFViewerPluginConfig;
  capture?: PDFViewerPluginConfig;
  redaction?: PDFViewerPluginConfig;
  print?: PDFViewerPluginConfig;
  export?: PDFViewerPluginConfig;
  fullscreen?: PDFViewerPluginConfig;
  stamp?: PDFViewerPluginConfig;
  signature?: PDFViewerPluginConfig;
  fonts?: PDFViewerFontsConfig;
  history?: PDFViewerPluginConfig;
  interactionManager?: PDFViewerPluginConfig;
}

/** 官方插件 registry 的稳定公开能力；运行时对象保留上游的全部额外方法。 */
export interface PluginRegistry {
  getPlugin<TPlugin = unknown>(pluginId: string): TPlugin | null;
  getAllPlugins(): unknown[];
  getPluginStatus(pluginId: string): unknown;
  getEngine(): unknown;
  getStore(): unknown;
  pluginsReady(): Promise<void>;
  destroy(): Promise<void>;
}

/** 官方 Web Component 容器的稳定公开能力。 */
export interface EmbedPdfContainer extends HTMLElement {
  config?: PDFViewerConfig;
  readonly registry: Promise<PluginRegistry>;
  readonly themePreference: 'light' | 'dark' | 'system';
  readonly activeColorScheme: 'light' | 'dark';
  setTheme(theme: PDFViewerPluginConfig | 'light' | 'dark' | 'system'): void;
  registerIcon(name: string, config: PDFViewerPluginConfig): void;
  registerIcons(icons: Record<string, PDFViewerPluginConfig>): void;
}

/** EmbedPdfVue 支持的渲染模式。 */
export type PreviewType = 'default' | 'iframe';

/** 查看器初始化或加载失败的阶段。 */
export type EmbedPdfVueErrorPhase =
  'component-import' | 'viewer-init' | 'document-load' | 'iframe-load';

/** EmbedPdfVue 的公开属性。 */
export interface EmbedPdfVueProps {
  src: string;
  title?: string;
  previewType?: PreviewType;
  defaultZoom?: ZoomLevel;
  initialPage?: number;
  height?: string;
  wasmUrl?: string;
  viewerConfig?: Omit<PDFViewerConfig, 'src' | 'wasmUrl'>;
}

/** 文档成功加载时发出的信息。 */
export interface EmbedPdfVueLoadEvent {
  src: string;
  documentId?: string;
  pageCount?: number;
}

/** 统一的错误事件，保留原始异常以便消费方记录。 */
export interface EmbedPdfVueError {
  src: string;
  phase: EmbedPdfVueErrorPhase;
  cause: unknown;
}

/** 组件通过模板 ref 暴露的命令式能力。 */
export interface EmbedPdfVueExpose {
  reload: () => Promise<void>;
  container: EmbedPdfContainer | null;
  registry: PluginRegistry | null;
}
