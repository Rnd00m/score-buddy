<template>
  <div class="color-picker-wrapper">
    <q-btn
      v-for="color in colors"
      :key="color.name"
      :style="{
        color: color.textColor,
        backgroundColor: color.value
      }"
      class="col"
      :disable="isColorAlreadyPicked(color.name)"
      @click="handleUpdatePlayerColor(color)"
    >
      {{ color.name }}
    </q-btn>
  </div>
</template>

<script setup lang="ts">
interface Props {
  playerId: number;
}

const props = defineProps<Props>();

import { Color, colors } from 'components/models';
import { useGameStore } from 'stores/game-store';
import { computed } from 'vue';

const emit = defineEmits<{
  (event: 'playerColorUpdated'): void
}>()

const store = useGameStore();

const alreadyPickedColors = computed(() => store.players.map(player => player.color.name));
const isColorAlreadyPicked = (colorName: string) => alreadyPickedColors.value.includes(colorName);

const handleUpdatePlayerColor = (color: Color) => {
  store.updatePlayerColor(props.playerId, color);

  emit('playerColorUpdated');
}
</script>

<style scoped lang="sass">
.color-picker-wrapper
  grid-template-columns: repeat(2, minmax(0, 1fr))
  display: grid
  row-gap: 1rem
  column-gap: 1rem
</style>
