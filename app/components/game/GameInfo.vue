<template>
  <div class="grid grid-cols-[auto_auto] gap-2 items-center w-fit mx-auto">
    <label class="text-left">Start score</label>
    <span>
      <Tag severity="contrast" :value="game.startScore" />
    </span>

    <label class="text-left">Ending score</label>
    <span>
      <Tag severity="contrast" :value="game.endingScore || '-'" />
    </span>

    <label class="text-left">Lowest possible score</label>
    <span>
      <Tag severity="contrast" :value="game.lowestPossibleScore || '-'" />
    </span>

    <label class="text-left">Win condition</label>
    <span>
      <Tag severity="contrast" :value="game.winCondition" />
    </span>
  </div>
</template>

<script setup lang="ts">
import type {Game} from "~/types/global";

defineProps<{
  game: Game;
}>();
</script>