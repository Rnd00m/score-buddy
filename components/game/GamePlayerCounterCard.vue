<template>
  <div
    v-if="roomStore.currentGame !== null"
    v-for="(player, index) in roomStore.players"
    :key="index"
    class="flex justify-between p-3 rounded-lg shadow-xl"
    :class="duelMode ? [index === 0 ? 'rotate-180' : '', 'flex-1'] : ''"
    :style="{ backgroundColor: player.color.value }"
  >
    <Button
      icon="pi pi-minus"
      severity="contrast"
      variant="text"
      raised
      :size="duelMode ? 'large' : undefined"
      :style="{
        backgroundColor: getButtonColor(player.color.value, 'dark'),
        color: getTextColorContrasted(player.color.value),
      }"
      :class="duelMode ? 'rounded-lg min-w-24 touch-none' : 'rounded-lg min-w-[68px] touch-none'"
      @mousedown="!isTouchDevice ? handleStartPress(() => handleDecrementScore(player)) : null"
      @mouseup="!isTouchDevice ? handleStopPress() : null"
      @mouseleave="!isTouchDevice ? handleStopPress() : null"
      @touchstart="handleStartPress(() => handleDecrementScore(player))"
      @touchend="handleStopPress"
      @touchcancel="handleStopPress"
    />

    <div class="flex flex-col items-center flex-1 mx-4 min-w-0" :class="duelMode ? 'justify-center' : ''">
      <h3 :style="{ color: getTextColorContrasted(player.color.value) }" class="w-full truncate text-center" :class="duelMode ? 'font-semibold text-3xl' : 'font-semibold text-xl'">{{ player.name }}</h3>
      <InputText
        v-if="editingPlayerUuid === player.uuid"
        v-focus
        v-model="editValue"
        type="text"
        inputmode="tel"
        unstyled
        :style="{ color: getTextColorContrasted(player.color.value) }"
        :class="duelMode ? 'font-bold text-6xl text-center bg-transparent border-none w-40 outline-none' : 'font-bold text-4xl text-center bg-transparent border-none w-28 outline-none'"
        @blur="applyScoreEdit(player)"
        @keyup.enter="applyScoreEdit(player)"
      />
      <p
        v-else
        v-ripple
        :style="{ color: getTextColorContrasted(player.color.value) }"
        :class="duelMode ? 'p-ripple font-bold text-7xl cursor-pointer select-none rounded-lg px-3' : 'p-ripple font-bold text-4xl cursor-pointer select-none rounded-lg px-3'"
        @click="startEditingScore(player)"
      >{{ roomStore.getPlayerScore(player)?.score || 0 }}</p>
    </div>

    <Button
      icon="pi pi-plus"
      severity="contrast"
      variant="text"
      raised
      :size="duelMode ? 'large' : undefined"
      :style="{
        backgroundColor: getButtonColor(player.color.value, 'dark'),
        color: getTextColorContrasted(player.color.value),
      }"
      :class="duelMode ? 'rounded-lg min-w-24 touch-none' : 'rounded-lg min-w-[68px] touch-none'"
      @mousedown="!isTouchDevice ? handleStartPress(() => handleIncrementScore(player)) : null"
      @mouseup="!isTouchDevice ? handleStopPress() : null"
      @mouseleave="!isTouchDevice ? handleStopPress() : null"
      @touchstart="handleStartPress(() => handleIncrementScore(player))"
      @touchend="handleStopPress"
      @touchcancel="handleStopPress"
    />
  </div>
</template>

<script lang="ts" setup>
import type {Player} from "~/types/global";

defineProps<{
  duelMode?: boolean;
}>();

const roomStore = useRoomStore();

const isTouchDevice = ref(false);

onMounted(() => {
  isTouchDevice.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
});

const handleIncrementScore = (player: Player) => {
  roomStore.incrementScore(player);
}

const handleDecrementScore = (player: Player) => {
  roomStore.decrementScore(player);
}

const getButtonColor = (color: string, type: 'light' | 'dark'): string => {
  return adjustColor(color, type);
};

const interval = ref<ReturnType<typeof setInterval> | null>(null);
const timeout = ref<ReturnType<typeof setTimeout> | null>(null);
const speedUpTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
const intervalSpeed = ref(100);

const handleStartPress = (action: () => void) => {
  action();

  timeout.value = setTimeout(() => {
    interval.value = setInterval(action, intervalSpeed.value);

    speedUpTimeout.value = setTimeout(() => {
      if (interval.value) clearInterval(interval.value);
      intervalSpeed.value = 50;
      interval.value = setInterval(action, intervalSpeed.value);
    }, 1000);
  }, 300);
};

const handleStopPress = () => {
  if (timeout.value) clearTimeout(timeout.value);
  if (speedUpTimeout.value) clearTimeout(speedUpTimeout.value);
  if (interval.value) clearInterval(interval.value);

  timeout.value = null;
  speedUpTimeout.value = null;
  interval.value = null;
  intervalSpeed.value = 100;
};

const editingPlayerUuid = ref<string | null>(null);
const editValue = ref('');

const vFocus = {
  mounted: (el: HTMLInputElement) => {
    el.focus();
  },
};

const startEditingScore = (player: Player) => {
  editingPlayerUuid.value = player.uuid;
  editValue.value = String(roomStore.getPlayerScore(player)?.score || 0);
};

const parseScoreInput = (value: string, currentScore: number): number | null => {
  const trimmed = value.replace(/\s+/g, '');

  const calcMatch = trimmed.match(/^(\d+)?([+-])(\d+)$/);
  if (calcMatch) {
    const [, base, sign, amount] = calcMatch;
    const baseValue = base !== undefined ? parseInt(base, 10) : currentScore;

    return sign === '+' ? baseValue + parseInt(amount, 10) : baseValue - parseInt(amount, 10);
  }

  if (/^\d+$/.test(trimmed)) {
    return parseInt(trimmed, 10);
  }

  return null;
};

const applyScoreEdit = (player: Player) => {
  if (editingPlayerUuid.value !== player.uuid) return;

  const currentScore = roomStore.getPlayerScore(player)?.score || 0;
  const newScore = parseScoreInput(editValue.value, currentScore);

  if (newScore !== null) {
    roomStore.setScore(player, newScore);
  }

  editingPlayerUuid.value = null;
};
</script>

<style scoped>

</style>