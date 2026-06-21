<template>
  <div v-if="roomStore.currentGame !== null" ref="cardsContainer" class="contents">
    <div
      v-for="player in roomStore.players"
      :key="player.uuid"
      class="player-score-card flex-1 flex flex-col p-3 rounded-lg shadow-xl cursor-grab"
      :class="roomStore.players[0]?.uuid === player.uuid ? 'rotate-180' : ''"
      :style="{ backgroundColor: player.color.value }"
    >
      <h3 :style="{ color: getTextColorContrasted(player.color.value) }" class="w-full truncate text-center font-bold text-5xl">{{ player.name }}</h3>

      <div class="flex-1 flex items-center justify-center">
        <InputText
          v-if="editingPlayerUuid === player.uuid"
          v-focus
          v-model="editValue"
          type="text"
          inputmode="tel"
          unstyled
          :style="{ color: getTextColorContrasted(player.color.value) }"
          class="no-drag font-bold text-6xl text-center bg-transparent border-none outline-none"
          @blur="applyScoreEdit(player)"
          @keyup.enter="applyScoreEdit(player)"
        />
        <p
          v-else
          v-ripple
          :style="{ color: getTextColorContrasted(player.color.value) }"
          class="no-drag p-ripple font-bold text-7xl cursor-pointer select-none rounded-lg px-3"
          @click="startEditingScore(player)"
        >{{ roomStore.getPlayerScore(player)?.score || 0 }}</p>
      </div>

      <div class="flex items-center gap-4">
        <Button
          icon="pi pi-minus"
          severity="contrast"
          variant="text"
          raised
          size="large"
          :style="{
            backgroundColor: getButtonColor(player.color.value, 'dark'),
            color: getTextColorContrasted(player.color.value),
          }"
          class="rounded-lg flex-1 h-16 touch-none no-drag"
          @mousedown="!isTouchDevice ? handleStartPress(() => handleDecrementScore(player)) : null"
          @mouseup="!isTouchDevice ? handleStopPress() : null"
          @mouseleave="!isTouchDevice ? handleStopPress() : null"
          @touchstart="handleStartPress(() => handleDecrementScore(player))"
          @touchend="handleStopPress"
          @touchcancel="handleStopPress"
        />

        <Button
          icon="pi pi-plus"
          severity="contrast"
          variant="text"
          raised
          size="large"
          :style="{
            backgroundColor: getButtonColor(player.color.value, 'dark'),
            color: getTextColorContrasted(player.color.value),
          }"
          class="rounded-lg flex-1 h-16 touch-none no-drag"
          @mousedown="!isTouchDevice ? handleStartPress(() => handleIncrementScore(player)) : null"
          @mouseup="!isTouchDevice ? handleStopPress() : null"
          @mouseleave="!isTouchDevice ? handleStopPress() : null"
          @touchstart="handleStartPress(() => handleIncrementScore(player))"
          @touchend="handleStopPress"
          @touchcancel="handleStopPress"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {Sortable} from "@shopify/draggable";

const roomStore = useRoomStore();

const {
  handleIncrementScore,
  handleDecrementScore,
  handleStartPress,
  handleStopPress,
  editingPlayerUuid,
  editValue,
  vFocus,
  startEditingScore,
  applyScoreEdit,
  getButtonColor,
} = useScoreCounterActions();

const isTouchDevice = ref(false);
const cardsContainer = ref<HTMLElement | null>(null);
let sortable: Sortable | null = null;

onMounted(() => {
  isTouchDevice.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (cardsContainer.value) {
    sortable = new Sortable(cardsContainer.value, {
      draggable: '.player-score-card',
      delay: { mouse: 0, drag: 0, touch: 100 },
      mirror: {
        constrainDimensions: true,
      },
    });

    sortable.on('drag:start', (event) => {
      const target = event.originalEvent?.target as HTMLElement | null;
      if (target?.closest('.no-drag')) {
        event.cancel();
      }
    });

    sortable.on('sortable:stop', (event) => {
      roomStore.reorderPlayers(event.oldIndex, event.newIndex);
    });
  }
});

onBeforeUnmount(() => {
  sortable?.destroy();
  sortable = null;
});
</script>

<style scoped>
.player-score-card {
  transition: opacity 0.15s ease, box-shadow 0.15s ease, outline 0.15s ease;
}

.player-score-card.draggable-source--is-dragging {
  opacity: 0.35;
}

.player-score-card.draggable--over {
  outline: 3px dashed rgba(255, 255, 255, 0.85);
  outline-offset: -3px;
}

.player-score-card.draggable-mirror {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
  opacity: 0.95;
  cursor: grabbing;
}

.player-score-card:active {
  cursor: grabbing;
}
</style>