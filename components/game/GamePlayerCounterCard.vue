<template>
  <div
    v-if="roomStore.currentGame !== null"
    v-for="(player, index) in roomStore.players"
    :key="index"
    class="flex justify-between p-3 rounded-lg shadow-xl"
    :style="{ backgroundColor: player.color.value }"
  >
    <Button
      icon="pi pi-minus"
      severity="contrast"
      variant="text"
      raised
      :style="{
        backgroundColor: getButtonColor(player.color.value, 'dark'),
        color: getTextColorContrasted(player.color.value),
      }"
      class="rounded-lg min-w-[68px]"
      @mousedown="handleStartPress(() => handleDecrementScore(player))"
      @mouseup="handleStopPress"
      @mouseleave="handleStopPress"
    />

    <div class="flex flex-col items-center flex-1 mx-4">
      <h3 :style="{ color: getTextColorContrasted(player.color.value) }" class="font-semibold text-xl">{{ player.name }}</h3>
      <p :style="{ color: getTextColorContrasted(player.color.value) }" class="font-bold text-4xl">{{ roomStore.getPlayerScore(player)?.score || 0 }}</p>
    </div>

    <Button
      icon="pi pi-plus"
      severity="contrast"
      variant="text"
      raised
      :style="{
        backgroundColor: getButtonColor(player.color.value, 'dark'),
        color: getTextColorContrasted(player.color.value),
      }"
      class="rounded-lg min-w-[68px]"
      @mousedown="handleStartPress(() => handleIncrementScore(player))"
      @mouseup="handleStopPress"
      @mouseleave="handleStopPress"
    />
  </div>
</template>

<script lang="ts" setup>
import type {Player} from "~/types/global";

const roomStore = useRoomStore();

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
</script>

<style scoped>

</style>