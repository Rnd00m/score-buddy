<template>
  <div class="h-[calc(100vh-118px)] grid place-items-center">
    <div class="flex flex-col items-center w-full gap-8" v-if="roomStore.players.length">
      <GameCallToActionCard
          headingText="New game"
          buttonText="Start"
          :buttonStyle="{
            backgroundColor: `var(--p-surface-900)`,
            borderColor: `var(--p-surface-900)`,
            color: `var(--p-primary-500)`,
          }"
          :cardStyle="{
            backgroundColor: `var(--p-primary-500)`,
            borderColor: `var(--p-primary-500)`,
            color: `var(--p-surface-900)`,
          }"
          icon="pi-play-circle"
          @buttonClicked="router.push('/games/new')"
      />
      <template v-if="roomStore.games.length">
        <GameCallToActionCard
          :headingText="roomStore.getLastCompletedGame.name"
          buttonText="Replay"
          :buttonStyle="{
            backgroundColor: `var(--p-primary-500)`,
            borderColor: `var(--p-primary-500)`,
            color: `var(--p-surface-900)`,
          }"
          :cardStyle="{
            backgroundColor: `var(--p-deep-blue-900)`,
            borderColor: `var(--p-deep-blue-900)`,
            color: `var(--p-surface-0)`,
          }"
          icon="pi-history"
          @buttonClicked="handleReplayGame"
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
import GameCallToActionCard from "~/components/game/GameCallToActionCard.vue";

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

  router.push('/game');
}
</script>