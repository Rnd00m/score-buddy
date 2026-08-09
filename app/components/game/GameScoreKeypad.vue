<template>
  <Dialog
    :visible="visible"
    modal
    :show-header="false"
    :closable="false"
    close-on-escape
    dismissable-mask
    :position="displayed.inverted ? 'top' : 'bottom'"
    :draggable="false"
    class="score-keypad-dialog w-full lg:max-w-md mx-0"
    :class="displayed.inverted
      ? 'mt-[var(--native-inset-top,0px)] mb-0'
      : 'mb-[var(--native-inset-bottom,0px)] mt-0'"
    content-class="!p-0 !overflow-hidden"
    @update:visible="(next: boolean) => { if (!next) emit('dismiss'); }"
  >
    <div class="flex flex-col min-h-[50dvh] max-h-[75dvh]" :class="{ 'rotate-180': displayed.inverted }">
      <div class="flex-1 flex flex-col min-h-0 rounded-t-lg" :style="{ backgroundColor: displayed.color, color: displayed.textColor }">
        <span v-if="displayed.playerName" class="shrink-0 text-2xl font-semibold opacity-80 truncate max-w-full text-center px-4 pt-3">{{ displayed.playerName }}</span>
        <div ref="displayContainer" class="score-keypad-value flex-1 flex flex-col items-center gap-1 px-4 py-2 min-h-0 overflow-y-auto overscroll-contain">
          <span class="font-bold text-6xl text-center break-all">{{ displayed.value || '0' }}</span>
        </div>
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

const props = defineProps<{
  visible: boolean;
  value: string;
  color?: string;
  textColor?: string;
  playerName?: string;
  inverted?: boolean;
}>();

// Keep showing the last-known player data while the dialog plays its leave
// transition, since the parent clears editingPlayer (and thus these props)
// the instant it closes — updating them live here would make the dialog
// visibly jump (color/position/rotation) mid fade-out.
const displayed = reactive({
  value: props.value,
  color: props.color,
  textColor: props.textColor,
  playerName: props.playerName,
  inverted: props.inverted,
});

watchEffect(() => {
  if (!props.visible) return;

  displayed.value = props.value;
  displayed.color = props.color;
  displayed.textColor = props.textColor;
  displayed.playerName = props.playerName;
  displayed.inverted = props.inverted;
});

// Long chained calculations (e.g. "+5+155+566+665...") can grow taller than
// the display area, so it scrolls; keep the most recently typed characters
// in view instead of leaving the scroll position wherever it happened to be.
const displayContainer = ref<HTMLElement | null>(null);

watch(() => displayed.value, async () => {
  await nextTick();
  if (displayContainer.value) {
    displayContainer.value.scrollTop = displayContainer.value.scrollHeight;
  }
});

const emit = defineEmits<{
  char: [char: string];
  backspace: [];
  confirm: [];
  dismiss: [];
}>();
</script>

<style>
.score-keypad-dialog.p-dialog {
  max-height: 75dvh;
  border: none;
}

/* justify-content: center clips the start of the content once it overflows
   a scroll container, making the first line of a long calculation
   unreachable even when scrolled all the way up. "safe center" keeps it
   centered while content fits, then falls back to start-aligned once it
   overflows so every line stays reachable. Browsers that don't support the
   "safe" keyword simply ignore the second declaration and keep centering. */
.score-keypad-value {
  justify-content: center;
  justify-content: safe center;
}
</style>
