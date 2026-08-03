<template>
  <Dialog
    :visible="visible"
    modal
    :show-header="false"
    :closable="false"
    close-on-escape
    dismissable-mask
    position="bottom"
    :draggable="false"
    class="score-keypad-dialog w-full lg:max-w-md m-0"
    content-class="!p-0 !overflow-hidden"
    @update:visible="(next: boolean) => { if (!next) emit('dismiss'); }"
  >
    <div class="flex flex-col h-[50dvh]">
      <div class="flex-1 flex flex-col items-center justify-center gap-1 px-4 min-h-0 rounded-t-lg" :style="{ backgroundColor: color, color: textColor }">
        <span v-if="playerName" class="text-2xl font-semibold opacity-80 truncate max-w-full">{{ playerName }}</span>
        <span class="font-bold text-6xl text-center break-all">{{ value || '0' }}</span>
      </div>

      <div class="p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shrink-0 bg-surface-0 dark:bg-surface-900">
        <div class="grid grid-cols-4 gap-2 w-full max-w-md mx-auto">
          <Button v-for="n in ['7', '8', '9']" :key="n" severity="secondary" size="large" class="h-16 text-2xl font-semibold" @click="emit('char', n)">{{ n }}</Button>
          <Button severity="secondary" size="large" class="h-16 !w-full" :aria-label="t('game.deleteLastDigit')" @click="emit('backspace')">
            <template #icon><ArrowLeft :size="28"/></template>
          </Button>

          <Button v-for="n in ['4', '5', '6']" :key="n" severity="secondary" size="large" class="h-16 text-2xl font-semibold" @click="emit('char', n)">{{ n }}</Button>
          <Button severity="secondary" size="large" class="h-16 !w-full" :aria-label="t('game.subtractOperator')" @click="emit('char', '-')">
            <template #icon><Minus :size="28"/></template>
          </Button>

          <Button v-for="n in ['1', '2', '3']" :key="n" severity="secondary" size="large" class="h-16 text-2xl font-semibold" @click="emit('char', n)">{{ n }}</Button>
          <Button severity="secondary" size="large" class="h-16 !w-full" :aria-label="t('game.addOperator')" @click="emit('char', '+')">
            <template #icon><Plus :size="28"/></template>
          </Button>

          <Button severity="secondary" size="large" class="h-16 col-span-2 text-2xl font-semibold" @click="emit('char', '0')">0</Button>
          <Button severity="contrast" size="large" class="h-16 col-span-2 !w-full text-lg font-semibold" @click="emit('confirm')">
            <template #icon><CheckCircle :size="22"/></template>
            {{ t('common.confirm') }}
          </Button>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import ArrowLeft from '@primeicons/vue/arrow-left';
import CheckCircle from '@primeicons/vue/check-circle';
import Minus from '@primeicons/vue/minus';
import Plus from '@primeicons/vue/plus';

const {t} = useI18n();

defineProps<{
  visible: boolean;
  value: string;
  color?: string;
  textColor?: string;
  playerName?: string;
}>();

const emit = defineEmits<{
  char: [char: string];
  backspace: [];
  confirm: [];
  dismiss: [];
}>();
</script>

<style scoped>
:deep(.score-keypad-dialog) {
  max-height: 60dvh;
}
</style>
