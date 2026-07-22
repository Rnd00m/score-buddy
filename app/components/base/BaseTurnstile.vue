<template>
  <div ref="containerRef"/>
</template>

<script setup lang="ts">
const props = defineProps<{
  siteKey: string;
}>();

const emit = defineEmits<{
  verified: [token: string];
  expired: [];
}>();

const {loadTurnstileScript} = useTurnstile();
const containerRef = ref<HTMLElement>();
let widgetId: string | undefined;

const renderWidget = () => {
  if (!containerRef.value || !window.turnstile) return;

  widgetId = window.turnstile.render(containerRef.value, {
    sitekey: props.siteKey,
    callback: (token: string) => emit('verified', token),
    'expired-callback': () => emit('expired'),
    'error-callback': () => emit('expired')
  });
};

const reset = () => {
  if (widgetId) window.turnstile?.reset(widgetId);
};

defineExpose({reset});

onMounted(async () => {
  await loadTurnstileScript();
  renderWidget();
});

onBeforeUnmount(() => {
  if (widgetId) window.turnstile?.remove(widgetId);
});
</script>
