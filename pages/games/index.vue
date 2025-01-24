<template>
  <ConfirmDialog group="confirm" class="max-w-80 w-[calc(100%-7rem)]">
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

  <h1 class="mb-6 flex justify-between items-center">
    <span class="text-3xl">Game</span>
    <div v-if="roomStore.currentGame" class="flex gap-3">
      <Button @click="handleResetGame" rounded severity="contrast" icon="pi pi-replay" />
      <Button @click="handleEndGame" rounded severity="danger" icon="pi pi-stop" />
    </div>
  </h1>

  <div v-if="roomStore.currentGame === null" class="h-[70vh] flex items-center justify-center">
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

  <div v-else class="flex flex-col gap-3">
    <GamePlayerCounterCard/>
  </div>
</template>

<script setup lang="ts">
const roomStore = useRoomStore();
const confirm = useConfirm();

const handleEndGame = () => {
  confirm.require({
    group: 'confirm',
    header: 'Are you sure?',
    message: "You're about to end the game.",
    accept: () => {
      roomStore.endGame();
    },
  });
};

const handleResetGame = () => {
  confirm.require({
    group: 'confirm',
    header: 'Are you sure?',
    message: "You're about to reset the current game. Points will be lost.",
    accept: () => {
      roomStore.resetGame();
    },
  });
};
</script>