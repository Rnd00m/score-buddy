<template>
  <div class="flex flex-col h-full">
    <BaseConfirmModal
      group="replay"
      icon="pi pi-replay"
      icon-bg-class="bg-primary"
      accept-label="Yes"
      reject-label="No"
    >
      <GameInfo v-if="selectedGame" :game="selectedGame" class="mt-2" />
    </BaseConfirmModal>

    <h1 class="mb-6 flex justify-between items-center shrink-0">
      <span class="text-3xl">History</span>
      <span class="inline-flex gap-2">
        <NuxtLink to="/games/new">
          <Button raised severity="contrast" :disabled="roomStore.players.length === 0" icon="pi pi-play" />
        </NuxtLink>
      </span>
    </h1>

    <GameHistoryTable :games="games" :paginator="false" @replay="handleReplayGame"/>
  </div>
</template>

<script setup lang="ts">
import type {Game} from "~/types/global";

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
      ? 'Your current game will be canceled without being saved. Do you want to continue?'
      : 'Do you want to start a new game with the same settings and your current lobby?',
    accept: () => {
      if (roomStore.currentGame !== null) {
        roomStore.cancelGame();
      }

      roomStore.startGame(
        game.name,
        game.startScore,
        game.endingScore,
        game.winCondition,
        game.lowestPossibleScore
      );

      router.push('/game');
    },
  });
};
</script>