<template>
  <div class="h-[calc(100vh-118px)] grid place-items-center">
    <div class="flex flex-col items-center gap-4" v-if="roomStore.players.length">
      <h2 class="text-3xl font-bold">Start a new game</h2>
      <NuxtLink to="/games/new">
        <Button
            class="h-16 w-16"
            icon="pi pi-play"
            severity="primary"
            aria-label="Start"
        />
      </NuxtLink>
      <template v-if="roomStore.games.length">
        <Divider align="center" class="bg-surface-20">
          <b>Or</b>
        </Divider>
        <h2 class="text-3xl font-bold">Replay {{ roomStore.getLastCompletedGame.name }}</h2>
        <Button
            class="h-16 w-16"
            icon="pi pi-play"
            severity="secondary"
            aria-label="Replay"
            @click="handleReplayGame"
        />
      </template>
    </div>
    <div class="flex flex-col items-center gap-4" v-else>
      <h2 class="text-3xl font-bold">Create a lobby</h2>
      <NuxtLink to="/rooms/players/add">
        <Button
            class="h-16 w-16"
            icon="pi pi-users"
            severity="primary"
            aria-label="Create lobby"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const roomStore = useRoomStore();
const router = useRouter();

const handleReplayGame = () => {
  const lastCompletedGame = roomStore.getLastCompletedGame;

  roomStore.startGame(
      lastCompletedGame.name,
      lastCompletedGame.startScore,
      lastCompletedGame.endingScore,
      lastCompletedGame.winCondition,
      lastCompletedGame.lowestPossibleScore
  );

  router.push('/games/current');
}
</script>