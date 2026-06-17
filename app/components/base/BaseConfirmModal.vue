<template>
  <ConfirmDialog :group="group" class="max-w-96 w-[calc(100%-6rem)]">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
        <div :class="['rounded-full text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20', iconBgClass]">
          <i :class="[icon, 'text-5xl']"></i>
        </div>
        <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
        <slot />
        <p :class="['mb-0', $slots.default ? 'mt-4' : '']">{{ message.message }}</p>
        <div class="flex items-center gap-2 mt-6">
          <Button :severity="acceptSeverity" :label="acceptLabel ?? t('common.confirm')" @click="acceptCallback"></Button>
          <Button :severity="rejectSeverity" :label="rejectLabel ?? t('common.cancel')" outlined @click="rejectCallback"></Button>
        </div>
      </div>
    </template>
  </ConfirmDialog>
</template>

<script setup lang="ts">
const {t} = useI18n();

withDefaults(defineProps<{
  group: string;
  icon?: string;
  iconBgClass?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  acceptSeverity?: string;
  rejectSeverity?: string;
}>(), {
  icon: 'pi pi-exclamation-circle',
  iconBgClass: 'bg-orange-500',
  acceptSeverity: 'contrast',
  rejectSeverity: 'secondary',
});
</script>