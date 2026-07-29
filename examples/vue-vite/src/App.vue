<script setup lang="ts">
import { Button } from '@polyloom/vue/button';
import { ref } from 'vue';

const saveCount = ref(0);
</script>

<template>
  <main class="demo-shell">
    <p class="demo-kicker">VUE 3 ADAPTER / 0.1.0</p>
    <h1>一根经线，<br />一个明确入口。</h1>
    <p class="demo-copy">当前保存次数：{{ saveCount }}</p>
    <div class="demo-actions">
      <Button @click="saveCount += 1">保存变更</Button>
      <Button variant="secondary">预览</Button>
      <Button variant="ghost">取消</Button>
    </div>
  </main>
</template>
