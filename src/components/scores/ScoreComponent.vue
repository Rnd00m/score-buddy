<template>
  <q-card
    class="score-card shadow-10"
    :style="{
      color: props.player.color.textColor,
      background: props.player.color.value
    }"
  >
    <q-card-section class="score-wrapper">
      <div class="row">
        <div class="col text-center">
          <q-btn
            push
            class="full-height full-width"
            icon="remove"
            v-touch-repeat:300:300:300:300:50.mouse.enter.space="decrementScore"
            @click="decrementScore"
          >
          </q-btn>
        </div>
        <div class="col-6 text-center text-h3 flex items-center justify-center column">
          <div
            class="text-h6"
          >
            {{ props.player.name }}
          </div>
          <div>
            {{ props.player.score }}
          </div>
        </div>
        <div class="col text-center">
          <q-btn
            icon="add"
            push
            class="full-height full-width"
            v-touch-repeat:300:300:300:300:50.mouse.enter.space="incrementScore"
            @click="incrementScore"
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
const emit = defineEmits<{
  (event: 'incrementScore', player: Player): void
  (event: 'decrementScore', player: Player): void
}>()

const incrementScore = () => emit('incrementScore', props.player);
const decrementScore = () => emit('decrementScore', props.player);
</script>

<style lang="sass">
.score-wrapper
  min-width: 350px
</style>
