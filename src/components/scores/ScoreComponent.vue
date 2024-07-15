<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">{{ props.player.name }}</div>
    </q-card-section>

    <q-card-section class="q-pt-none score-wrapper">
      <div class="row justify-between items-center">
        <div class="col text-center">
          <q-btn
            icon="remove"
            size="md"
            round
            @click="$emit('decrementScore', player)"
          >
          </q-btn>
        </div>
        <div class="col-6 text-center text-h3">{{ props.player.score }}</div>
        <div class="col text-center">
          <q-btn
            icon="add"
            size="md"
            round
            @click="$emit('incrementScore', player)"
          >
          </q-btn>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { Player } from '../models';

interface Props {
  player: Player;
}

const props = defineProps<Props>();
</script>

<style>
@media (min-width: 640px) {
  .scores-wrapper {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.scores-wrapper {
  display: grid;
  row-gap: 1.5rem;
  column-gap: 1.5rem;
}

.score-wrapper {
  width: 300px;
}
</style>
