<script setup lang="ts">
import { resolveButtonState } from '@polyloom/core/button';
import { computed } from 'vue';
import type { ButtonProps } from './types.js';

defineOptions({
  name: 'PlButton',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ButtonProps>(), {
  disabled: false,
  loading: false,
  size: 'md',
  type: 'button',
  variant: 'primary',
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const buttonState = computed(() =>
  resolveButtonState({
    disabled: props.disabled,
    loading: props.loading,
  }),
);

function handleClick(event: MouseEvent) {
  // disabled 原生按钮不会触发 click；这里额外保护程序化触发与未来渲染适配。
  if (buttonState.value.disabled) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  emit('click', event);
}
</script>

<template>
  <button
    v-bind="$attrs"
    :aria-busy="buttonState.ariaBusy"
    :class="['pl-button', `pl-button--${variant}`, `pl-button--${size}`]"
    :disabled="buttonState.disabled"
    :type="type"
    @click="handleClick"
  >
    <span v-if="loading" aria-hidden="true" class="pl-button__spinner" />
    <span class="pl-button__label">
      <slot />
    </span>
  </button>
</template>
