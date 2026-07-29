/**
 * 延迟加载 EmbedPDF 浏览器运行时；单独封装便于验证 SSR 不会触发导入。
 */
export function loadEmbedPdfVueRuntime() {
  return import('@embedpdf/vue-pdf-viewer');
}
