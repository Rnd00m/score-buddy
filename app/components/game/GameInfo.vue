<template>
  <div class="grid grid-cols-[auto_auto] gap-2 items-center w-fit mx-auto">
    <label class="text-left">{{ t('gameInfo.startScore') }}</label>
    <span>
      <Tag severity="contrast" :value="game.startScore" />
    </span>

    <label class="text-left">{{ t('gameInfo.endingScore') }}</label>
    <span>
      <Tag severity="contrast" :value="game.endingScore || '-'" />
    </span>

    <label class="text-left">{{ t('gameInfo.lowestPossibleScore') }}</label>
    <span>
      <Tag severity="contrast" :value="game.lowestPossibleScore || '-'" />
    </span>

    <label class="text-left">{{ t('gameInfo.winCondition') }}</label>
    <span>
      <Tag severity="contrast" :value="t(`winCondition.${game.winCondition}`)" />
    </span>
  </div>
</template>

<script setup lang="ts">
import type {Game} from "~/types/global";

const {t} = useI18n();

defineProps<{
  game: Game;
}>();
</script>