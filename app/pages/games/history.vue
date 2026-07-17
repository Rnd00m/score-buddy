<template>
  <div class="flex flex-col h-full">
    <BaseConfirmModal
      group="replay"
      :icon="Replay"
      icon-bg-class="bg-primary"
      :accept-label="t('common.yes')"
      :reject-label="t('common.no')"
    >
      <GameInfo v-if="selectedGame" :game="selectedGame" class="mt-2" />
    </BaseConfirmModal>

    <h1 class="mb-6 flex justify-between items-center shrink-0">
      <span class="text-3xl">{{ t('gamesHistory.title') }}</span>
      <span class="inline-flex gap-2">
        <NuxtLink to="/games/new">
          <Button raised severity="contrast" :disabled="roomStore.players.length === 0">
            <template #icon><Play :size="18"/></template>
          </Button>
        </NuxtLink>
      </span>
    </h1>

    <GameHistoryTable :games="games" :paginator="false" @replay="handleReplayGame"/>
  </div>
</template>

<script setup lang="ts">
import type {Game} from "~/types/global";
import Replay from '@primeicons/vue/replay';
import Play from '@primeicons/vue/play';

const {t} = useI18n();
const roomStore = useRoomStore();
const router = useRouter();
const confirm = useConfirm();

const games = computed(() => roomStore.games.map(game => ({
  ...game,
  createdAtTime: new Date(game.createdAt).getTime(),
})));

const selectedGame = ref<Game | null>(null);

const handleReplayGame = (game: Game) => {
  selectedGame.value = game;

  confirm.require({
    group: 'replay',
    header: game.name,
    message: roomStore.currentGame !== null
      ? t('gamesHistory.replayCurrentCanceled')
      : t('gamesHistory.replayStartNew'),
    accept: () => {
      if (roomStore.currentGame !== null) {
        roomStore.cancelGame();
      }

      roomStore.startGame(
        game.name,
        game.startScore,
        game.endingScore,
        game.winCondition,
        game.lowestPossibleScore,
        game.winningRounds ?? 1
      );

      router.push('/game');
    },
  });
};
</script>