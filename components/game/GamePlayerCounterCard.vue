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
      @click="handleDecrementScore(player)"
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
      @click="handleIncrementScore(player)"
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
</script>


<style scoped>

</style>