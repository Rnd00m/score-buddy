<template>
  <h1 class="mb-6 flex justify-between items-center">
    <span class="text-3xl">Game</span>
  </h1>

  <div class="h-[70vh] flex items-center justify-center">
    <div class="flex flex-col items-center gap-4" v-if="roomStore.players.length">
      <h2 class="text-2xl font-bold">Start a new game</h2>
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
        <h2 class="text-2xl font-bold">Replay</h2>
        <GameTypesTable />
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
</script>