<template>
  <InputNumber
    v-model="model"
    show-buttons
    button-layout="horizontal"
    :step="step"
    v-bind="$attrs"
    @mousedown="blurSpinnerButtonFocus"
  >
    <template #incrementicon><Plus :size="14"/></template>
    <template #decrementicon><Minus :size="14"/></template>
  </InputNumber>
</template>

<script setup lang="ts">
import Plus from '@primeicons/vue/plus';
import Minus from '@primeicons/vue/minus';

defineOptions({inheritAttrs: false});

withDefaults(defineProps<{
  step?: number;
}>(), {
  step: 1,
});

const model = defineModel<number | null>();

const isTouchDevice = ref(false);

onMounted(() => {
  isTouchDevice.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
});

// PrimeVue's InputNumber spin buttons focus the underlying input on mousedown (so
// keyboard arrow keys can keep spinning it), which pops up the mobile keyboard.
// Blurring right after lets that focus-triggered keyboard never actually appear.
const blurSpinnerButtonFocus = (event: MouseEvent) => {
  if (!isTouchDevice.value) return;
  if (!(event.target as HTMLElement).closest('button')) return;

  (document.activeElement as HTMLElement | null)?.blur();
};
</script>
