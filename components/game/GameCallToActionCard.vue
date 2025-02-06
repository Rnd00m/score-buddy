<template>
  <Card class="card w-[calc(100%-4rem)] p-2 border-4" :style="colorStyle">
    <template #content>
      <div class="flex flex-col items-center justify-center text-xl font-bold gap-4">
        <i class="pi" :class="icon" style="font-size: 4.5rem"></i>

        <div class="header">{{ headingText }}</div>
        <Button class="button border-2 px-4 py-2" :style="colorStyle" @click="emit('buttonClicked')">{{ buttonText }}</Button>
      </div>
    </template>
  </Card>

</template>

<script lang="ts" setup>
const emit = defineEmits(['buttonClicked']);

const props = defineProps<{
  color: string;
  headingText: string;
  buttonText: string;
  icon: string;
}>();

const colorStyle = computed(() => {
  return {
    backgroundColor: `var(--p-${props.color}-900)`,
    borderColor: `var(--p-${props.color}-300)`,
    color: `var(--p-${props.color}-300)`,
  };
});
</script>

<style scoped lang="scss">
</style>