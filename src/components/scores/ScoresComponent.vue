<template>
  <div class="scores-wrapper">
    <div v-for="player in store.players" :key="player.name">
      <score-component
        :player="player"
        @incrementScore="incrementScoreCallback"
        @decrementScore="decrementScoreCallback"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Player } from '../models';
import ScoreComponent from 'components/scores/ScoreComponent.vue';
import { useGameStore } from 'stores/game-store';

const store = useGameStore()

function incrementScoreCallback(player: Player) {
  store.increment(player.id)
}

function decrementScoreCallback(player: Player) {
  store.decrement(player.id)
}
</script>

<style lang="sass">
@media (min-width: 640px)
  .scores-wrapper
    grid-template-columns: repeat(2, minmax(0, 1fr))

.scores-wrapper
  display: grid
  row-gap: 1.5rem
  column-gap: 1.5rem
</style>
