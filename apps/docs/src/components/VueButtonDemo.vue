<script setup lang="ts">
import { Button } from '@polyloom/vue/button';
import { onMounted, ref } from 'vue';
import '@polyloom/vue/button/style.css';

const count = ref(0);
const hydrated = ref(false);

onMounted(() => {
  hydrated.value = true;
});
</script>

<template>
  <section
    class="pl-demo-card"
    data-demo-framework="vue"
    :data-hydrated="hydrated ? 'true' : 'false'"
  >
    <p class="pl-demo-card__label">VUE / SLOT + EMIT</p>
    <div class="pl-demo-card__actions">
      <Button @click="count += 1">编织 {{ count }}</Button>
      <Button variant="secondary">检查</Button>
      <Button variant="ghost">退回</Button>
    </div>
  </section>
</template>
