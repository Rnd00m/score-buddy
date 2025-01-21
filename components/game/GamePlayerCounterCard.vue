<template>
  <div
    v-for="(player, index) in roomStore.players"
    :key="index"
    class="flex justify-between p-3 rounded-lg shadow-lg"
    :style="{ backgroundColor: player.color.value }"
  >
    <Button
      icon="pi pi-minus"
      severity="contrast"
      variant="text"
      raised
      :style="{
        backgroundColor: getButtonColor(player.color.value, 'dark'),
        color: getTextColor(player.color.value),
      }"
      class="rounded-lg min-w-[60px]"
      @click="handleDecrementScore(player)"
    />

    <div class="flex flex-col items-center flex-1 mx-4">
      <h3 :style="{ color: getTextColor(player.color.value) }" class="font-semibold text-lg">{{ player.name }}</h3>
      <p :style="{ color: getTextColor(player.color.value) }" class="font-bold text-2xl">{{ player.score }}</p>
    </div>

    <Button
      icon="pi pi-plus"
      severity="contrast"
      variant="text"
      raised
      :style="{
        backgroundColor: getButtonColor(player.color.value, 'dark'),
        color: getTextColor(player.color.value),
      }"
      class="rounded-lg min-w-[60px]"
      @click="handleIncrementScore(player)"
    />
  </div>
</template>

<script lang="ts" setup>
import type {Player} from "~/types/global";

const roomStore = useRoomStore();

const getContrastYIQ = (hexColor: string): string => {
  const color = hexColor.replace("#", "");
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#FFFFFF';
};

const getTextColor = (color: string): string => {
  return getContrastYIQ(color) || '#000000';
};

const adjustColor = (hexColor: string, type: 'light' | 'dark'): string => {
  let color = hexColor.replace("#", "");
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);

  if (type === 'dark') {
    r = Math.max(r - 40, 0);
    g = Math.max(g - 40, 0);
    b = Math.max(b - 40, 0);
  } else {
    r = Math.min(r + 40, 255);
    g = Math.min(g + 40, 255);
    b = Math.min(b + 40, 255);
  }

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const handleIncrementScore = (player: Player) => {
  roomStore.incrementScore(player);
}

const handleDecrementScore = (player: Player) => {
  roomStore.decrementScore(player);
}

const getButtonColor = (color: string, type: 'light' | 'dark'): string => {
  return adjustColor(color, type);
};
</script>


<style scoped>

</style>