<template>
  <div class="flex flex-col h-full">
    <Toast position="bottom-center" class="max-w-[calc(100%-2rem)]"/>

    <h1 class="mb-6 flex items-center gap-4 shrink-0">
      <NuxtLink to="/rooms">
        <Button severity="secondary">
          <template #icon><ArrowLeft :size="18"/></template>
        </Button>
      </NuxtLink>
      <span class="text-3xl">{{ t('timer.title') }}</span>
    </h1>

    <div class="flex-1 flex flex-col items-center justify-center gap-8">
      <div class="relative flex items-center justify-center w-full max-w-80 aspect-square">
        <ProgressSpinner class="timer-spinner w-full h-full" :strokeWidth="4" :value="remainingPercent"/>
        <span class="absolute text-6xl font-bold tabular-nums">{{ formattedRemainingTime }}</span>
      </div>

      <div class="flex items-end gap-4">
        <div class="flex flex-col items-center gap-1" @mousedown="blurSpinnerButtonFocus">
          <label for="minutes">{{ t('timer.minutes') }}</label>
          <InputNumber
            id="minutes"
            v-model="minutes"
            :min="0"
            :max="99"
            showButtons
            buttonLayout="horizontal"
            :step="1"
            inputClass="w-16 text-center"
            :disabled="isRunning"
          >
            <template #incrementicon><Plus :size="14"/></template>
            <template #decrementicon><Minus :size="14"/></template>
          </InputNumber>
        </div>
        <span class="text-2xl mb-2">:</span>
        <div class="flex flex-col items-center gap-1" @mousedown="blurSpinnerButtonFocus">
          <label for="seconds">{{ t('timer.seconds') }}</label>
          <InputNumber
            id="seconds"
            v-model="seconds"
            :min="0"
            :max="59"
            showButtons
            buttonLayout="horizontal"
            :step="1"
            inputClass="w-16 text-center"
            :disabled="isRunning"
          >
            <template #incrementicon><Plus :size="14"/></template>
            <template #decrementicon><Minus :size="14"/></template>
          </InputNumber>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <Button
          :label="startPauseLabel"
          severity="contrast"
          :disabled="totalDuration === 0"
          @click="toggleTimer"
        >
          <template #icon><component :is="isRunning ? Pause : Play" :size="18"/></template>
        </Button>
        <Button :label="t('timer.reset')" severity="secondary" outlined @click="resetTimer">
          <template #icon><Refresh :size="18"/></template>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ArrowLeft from '@primeicons/vue/arrow-left';
import Plus from '@primeicons/vue/plus';
import Minus from '@primeicons/vue/minus';
import Pause from '@primeicons/vue/pause';
import Play from '@primeicons/vue/play';
import Refresh from '@primeicons/vue/refresh';

const {t} = useI18n();
const toast = useToast();

const minutes = ref(1);
const seconds = ref(0);

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

const totalDuration = computed(() => (minutes.value ?? 0) * 60 + (seconds.value ?? 0));

const remainingSeconds = ref(totalDuration.value);
const isRunning = ref(false);
let intervalId: ReturnType<typeof setInterval> | null = null;

watch(totalDuration, (newTotal) => {
  if (!isRunning.value) {
    remainingSeconds.value = newTotal;
  }
});

const formattedRemainingTime = computed(() => {
  const clamped = Math.max(remainingSeconds.value, 0);
  const displayMinutes = Math.floor(clamped / 60);
  const displaySeconds = clamped % 60;

  return `${String(displayMinutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}`;
});

const remainingPercent = computed(() => {
  if (totalDuration.value === 0) return 0;

  return Math.min(Math.max((remainingSeconds.value / totalDuration.value) * 100, 0), 100);
});

const startPauseLabel = computed(() => {
  if (isRunning.value) return t('timer.pause');

  return remainingSeconds.value > 0 && remainingSeconds.value < totalDuration.value
      ? t('timer.resume')
      : t('timer.start');
});

const clearTimerInterval = () => {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

const finishTimer = () => {
  clearTimerInterval();
  isRunning.value = false;
  remainingSeconds.value = 0;

  if ('vibrate' in navigator) {
    navigator.vibrate(300);
  }

  toast.add({severity: 'success', summary: t('timer.finishedTitle'), detail: t('timer.finishedMessage'), life: 4000});
};

const startTimer = () => {
  if (remainingSeconds.value <= 0) {
    remainingSeconds.value = totalDuration.value;
  }

  isRunning.value = true;
  intervalId = setInterval(() => {
    remainingSeconds.value--;

    if (remainingSeconds.value <= 0) {
      finishTimer();
    }
  }, 1000);
};

const pauseTimer = () => {
  clearTimerInterval();
  isRunning.value = false;
};

const toggleTimer = () => {
  if (isRunning.value) {
    pauseTimer();
  } else {
    startTimer();
  }
};

const resetTimer = () => {
  clearTimerInterval();
  isRunning.value = false;
  remainingSeconds.value = totalDuration.value;
};

onUnmounted(() => {
  clearTimerInterval();
});
</script>

<style scoped>
.timer-spinner :deep(.p-progressspinner-circle-track) {
  stroke: var(--p-surface-200);
}

.app-dark .timer-spinner :deep(.p-progressspinner-circle-track) {
  stroke: var(--p-surface-700);
}

.timer-spinner :deep(.p-progressspinner-circle-range) {
  stroke: var(--p-primary-500);
}

.timer-spinner :deep(.p-progressspinner-value) {
  display: none;
}
</style>
