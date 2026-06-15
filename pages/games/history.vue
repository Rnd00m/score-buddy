<template>
  <div class="flex flex-col h-full">
    <Toast position="top-center" class="max-w-[calc(100%-2rem)]"/>
    <ConfirmDialog group="remove" class="max-w-96 w-[calc(100%-6rem)]">
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
          <div class="rounded-full bg-orange-500 text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20">
            <i class="pi pi-exclamation-circle text-5xl"></i>
          </div>
          <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
          <p class="mb-0">{{ message.message }}</p>
          <div class="flex items-center gap-2 mt-6">
            <Button severity="contrast" label="Confirm" @click="acceptCallback"></Button>
            <Button severity="secondary" label="Cancel" outlined @click="rejectCallback"></Button>
          </div>
        </div>
      </template>
    </ConfirmDialog>

    <h1 class="mb-6 flex justify-between items-center shrink-0">
      <span class="text-3xl">History</span>
      <span class="inline-flex gap-2">
      <NuxtLink to="/games/new">
          <Button raised severity="contrast" :disabled="roomStore.players.length ===0" icon="pi pi-play" />
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

const games = computed(() => roomStore.games.map(game => ({
  ...game,
  createdAtTime: new Date(game.createdAt).getTime(),
})));

const handleReplayGame = (game: Game) => {
  roomStore.startGame(
      game.name,
      game.startScore,
      game.endingScore,
      game.winCondition,
      game.lowestPossibleScore
  );

  router.push('/game');
}
</script>