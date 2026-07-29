<script setup lang="ts">
import wasmUrl from '@embedpdf/pdfium/pdfium.wasm?url';
import { EmbedPdfVue, type PreviewType } from '@polyloom/vue/embedpdf-vue';
import { onMounted, ref } from 'vue';
import demoPdfUrl from '../assets/polyloom-embedpdf-demo.pdf?url';
import '@polyloom/vue/embedpdf-vue/style.css';

const hydrated = ref(false);
const previewType = ref<PreviewType>('default');
const eventStatus = ref('等待文档');
const documentSource = ref(demoPdfUrl);

function toggleBrokenDocument() {
  documentSource.value =
    documentSource.value === demoPdfUrl ? '/__polyloom_missing_document__.pdf' : demoPdfUrl;
  eventStatus.value = documentSource.value === demoPdfUrl ? '正在恢复示例' : '正在演练错误';
}

onMounted(() => {
  hydrated.value = true;
});
</script>

<template>
  <section
    class="pl-embedpdf-demo"
    data-demo-framework="vue"
    :data-hydrated="hydrated ? 'true' : 'false'"
  >
    <div class="pl-embedpdf-demo__controls" aria-label="预览模式">
      <button
        :aria-pressed="previewType === 'default'"
        type="button"
        @click="previewType = 'default'"
      >
        PDF 工作台
      </button>
      <button
        :aria-pressed="previewType === 'iframe'"
        type="button"
        @click="previewType = 'iframe'"
      >
        iframe 回退
      </button>
      <button type="button" @click="toggleBrokenDocument">
        {{ documentSource === demoPdfUrl ? '错误演练' : '恢复示例' }}
      </button>
      <output aria-live="polite">{{ eventStatus }}</output>
    </div>

    <EmbedPdfVue
      data-testid="embedpdf-vue-demo"
      height="34rem"
      :initial-page="2"
      :preview-type="previewType"
      :src="documentSource"
      title="PolyLoom 架构说明"
      :viewer-config="{
        fonts: { ui: null, signature: null },
        i18n: { defaultLocale: 'zh-CN' },
        stamp: { defaultLibrary: false, libraries: [], manifests: [] },
        worker: false,
      }"
      :wasm-url="wasmUrl"
      @error="eventStatus = '加载失败'"
      @load="eventStatus = '两页文档已加载'"
      @ready="eventStatus = '查看器已就绪'"
    />
  </section>
</template>
