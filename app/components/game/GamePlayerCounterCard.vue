<template>
  <div v-if="roomStore.currentGame !== null" ref="cardsContainer" class="contents">
    <div
      v-for="player in roomStore.players"
      :key="player.uuid"
      class="player-score-card flex flex-col p-3 rounded-lg shadow-xl cursor-grab"
      :style="{ backgroundColor: player.color.value }"
    >
      <div class="flex justify-between">
        <div
          class="flex flex-col items-center no-drag"
          @mousedown.capture="updateDirection($event, `${player.uuid}-dec`, 'down', getQuickDecrementItems(player).length)"
          @touchstart.capture="updateDirection($event, `${player.uuid}-dec`, 'down', getQuickDecrementItems(player).length)"
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
            class="rounded-t-lg rounded-b-none min-w-[68px] h-10 touch-none no-drag"
            @mousedown="!isTouchDevice ? handleStartPress(() => handleDecrementScore(player)) : null"
            @mouseup="!isTouchDevice ? handleStopPress() : null"
            @mouseleave="!isTouchDevice ? handleStopPress() : null"
            @touchstart="handleStartPress(() => handleDecrementScore(player))"
            @touchend="handleStopPress"
            @touchcancel="handleStopPress"
          />
          <SpeedDial
            class="speed-dial-glued"
            button-class="rounded-b-lg rounded-t-none min-w-[68px] h-8"
            :model="getQuickDecrementItems(player)"
            type="linear"
            :direction="getDirection(`${player.uuid}-dec`, 'down')"
            :rotate-animation="false"
            :aria-label="t('game.quickRemovePoints')"
            :button-props="{
              severity: 'contrast',
              variant: 'text',
              raised: true,
              style: { backgroundColor: getButtonColor(player.color.value, 'dark'), color: getTextColorContrasted(player.color.value) }
            }"
          >
            <template #icon="{ visible }">
              <i class="pi pi-bolt quick-score-toggle-icon" :class="{ 'quick-score-toggle-icon-open': visible }" />
            </template>
            <template #item="{ item }">
              <div class="contents">
                <Button
                  severity="contrast"
                  variant="text"
                  raised
                  type="button"
                  class="flex items-center justify-center text-center leading-none rounded-full text-base font-bold p-3"
                  :style="{
                    backgroundColor: getButtonColor(player.color.value, 'dark'),
                    color: getTextColorContrasted(player.color.value),
                  }"
                  @click.stop="item.command?.({ originalEvent: $event, item })"
                >{{ item.label }}</Button>
              </div>
            </template>
          </SpeedDial>
        </div>

        <div class="flex flex-col items-center justify-center flex-1 mx-4 min-w-0">
          <h3 :style="{ color: getTextColorContrasted(player.color.value) }" class="w-full truncate text-center font-semibold text-xl">{{ player.name }}</h3>
          <InputText
            v-if="editingPlayerUuid === player.uuid"
            v-focus
            v-auto-fit-font-size="editValue"
            v-model="editValue"
            type="text"
            inputmode="tel"
            unstyled
            :style="{ color: getTextColorContrasted(player.color.value) }"
            class="no-drag font-bold text-4xl text-center bg-transparent border-none w-28 max-w-full outline-none"
            @blur="applyScoreEdit(player)"
            @keyup.enter="applyScoreEdit(player)"
          />
          <p
            v-else
            v-ripple
            v-auto-fit-font-size="roomStore.getPlayerScore(player)?.score"
            :style="{ color: getTextColorContrasted(player.color.value) }"
            class="no-drag p-ripple font-bold text-4xl cursor-pointer select-none rounded-lg px-3 max-w-full"
            @click="startEditingScore(player)"
          >{{ roomStore.getPlayerScore(player)?.score || 0 }}</p>
        </div>

        <div
          class="flex flex-col items-center no-drag"
          @mousedown.capture="updateDirection($event, `${player.uuid}-inc`, 'down', getQuickIncrementItems(player).length)"
          @touchstart.capture="updateDirection($event, `${player.uuid}-inc`, 'down', getQuickIncrementItems(player).length)"
        >
          <Button
            icon="pi pi-plus"
            severity="contrast"
            variant="text"
            raised
            :style="{
              backgroundColor: getButtonColor(player.color.value, 'dark'),
              color: getTextColorContrasted(player.color.value),
            }"
            class="rounded-t-lg rounded-b-none min-w-[68px] h-10 touch-none no-drag"
            @mousedown="!isTouchDevice ? handleStartPress(() => handleIncrementScore(player)) : null"
            @mouseup="!isTouchDevice ? handleStopPress() : null"
            @mouseleave="!isTouchDevice ? handleStopPress() : null"
            @touchstart="handleStartPress(() => handleIncrementScore(player))"
            @touchend="handleStopPress"
            @touchcancel="handleStopPress"
          />
          <SpeedDial
            class="speed-dial-glued"
            button-class="rounded-b-lg rounded-t-none min-w-[68px] h-8"
            :model="getQuickIncrementItems(player)"
            type="linear"
            :direction="getDirection(`${player.uuid}-inc`, 'down')"
            :rotate-animation="false"
            :aria-label="t('game.quickAddPoints')"
            :button-props="{
              severity: 'contrast',
              variant: 'text',
              raised: true,
              style: { backgroundColor: getButtonColor(player.color.value, 'dark'), color: getTextColorContrasted(player.color.value) }
            }"
          >
            <template #icon="{ visible }">
              <i class="pi pi-bolt quick-score-toggle-icon" :class="{ 'quick-score-toggle-icon-open': visible }" />
            </template>
            <template #item="{ item }">
              <div class="contents">
                <Button
                  severity="contrast"
                  variant="text"
                  raised
                  type="button"
                  class="flex items-center justify-center text-center leading-none rounded-full text-base font-bold p-3"
                  :style="{ backgroundColor: getButtonColor(player.color.value, 'dark'), color: getTextColorContrasted(player.color.value) }"
                  @click.stop="item.command?.({ originalEvent: $event, item })"
                >{{ item.label }}</Button>
              </div>
            </template>
          </SpeedDial>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {Sortable} from "@shopify/draggable";

const {t} = useI18n();
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
  getQuickDecrementItems,
  getQuickIncrementItems,
} = useScoreCounterActions();

const {vAutoFitFontSize} = useAutoFitFontSize();
const {updateDirection, getDirection} = useSpeedDialDirection();

const isTouchDevice = ref(false);
const cardsContainer = ref<HTMLElement | null>(null);
let sortable: Sortable | null = null;

onMounted(async () => {
  isTouchDevice.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (cardsContainer.value) {
    const {Sortable} = await import("@shopify/draggable");

    // cardsContainer may have been unmounted while the dynamic import was
    // still loading (e.g. duel mode toggling right after mount)
    if (!cardsContainer.value) return;

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

:deep(.speed-dial-glued) {
  position: relative;
  gap: 0 !important;
}

:deep(.speed-dial-glued.p-speeddial-linear .p-speeddial-list) {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

:deep(.speed-dial-glued.p-speeddial-direction-down .p-speeddial-list) {
  top: 125%;
}

:deep(.speed-dial-glued.p-speeddial-direction-up .p-speeddial-list) {
  bottom: 125%;
}

.quick-score-toggle-icon {
  display: inline-block;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.quick-score-toggle-icon-open {
  transform: rotate(45deg);
}
</style>