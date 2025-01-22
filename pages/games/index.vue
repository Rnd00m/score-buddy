<template>
  <h1 class="text-3xl mb-6">Game</h1>

  <div v-if="roomStore.getActiveGame === null" class="h-[70vh] flex items-center justify-center">
    <div class="flex flex-col items-center gap-4" v-if="roomStore.players.length">
      <h2 class="text-3xl font-bold">Start a new game</h2>
      <NuxtLink to="/games/new">
        <Button
            class="h-16 w-16"
            icon="pi pi-play"
            severity="primary"
            aria-label="Search"
        />
      </NuxtLink>
    </div>
    <div class="flex flex-col items-center gap-4" v-else>
      <h2 class="text-3xl font-bold">Create a lobby</h2>
      <NuxtLink to="/rooms/players/add">
        <Button
            class="h-16 w-16"
            icon="pi pi-users"
            severity="primary"
            aria-label="Search"
        />
      </NuxtLink>
    </div>
  </div>

  <div v-else class="flex flex-col gap-3">
    <GamePlayerCounterCard/>
  </div>
</template>

<script setup lang="ts">
const roomStore = useRoomStore();
</script>