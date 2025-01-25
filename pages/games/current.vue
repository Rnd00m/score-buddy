<template>
  <ConfirmDialog group="confirm" class="max-w-96 w-[calc(100%-6rem)]">
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

  <ConfirmDialog group="end" class="max-w-96 w-[calc(100%-6rem)]">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
        <div class="rounded-full bg-primary text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20">
          <i class="pi pi-trophy text-5xl"></i>
        </div>
        <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
        <p class="mb-0">{{ message.message }}</p>
        <div class="flex items-center gap-2 mt-6">
          <Button label="Confirm" @click="acceptCallback"></Button>
          <Button label="Cancel" outlined @click="rejectCallback"></Button>
        </div>
      </div>
    </template>
  </ConfirmDialog>

  <h1 class="mb-6 flex justify-between items-center">
    <span class="text-3xl">Game</span>
    <div class="flex gap-3">
      <Button @click="handleResetGame" rounded severity="contrast" icon="pi pi-replay" />
      <Button @click="handleEndGame" rounded severity="danger" icon="pi pi-stop" />
    </div>
  </h1>

  <div class="flex flex-col gap-3">
    <GamePlayerCounterCard/>
  </div>
</template>

<script setup lang="ts">
const roomStore = useRoomStore();
const confirm = useConfirm();
const router = useRouter();

const handleEndGame = () => {
  confirm.require({
    group: 'confirm',
    header: 'Are you sure?',
    message: "You're about to end the game.",
    accept: () => {
      roomStore.endGame();
      handleGameFinished();
    },
  });
};

const handleResetGame = () => {
  confirm.require({
    group: 'confirm',
    header: 'Are you sure?',
    message: "You're about to reset the current game, all points will be lost.",
    accept: () => {
      roomStore.resetGame();
    },
  });
};

const handleGameFinished = () => {
  confirm.require({
    group: 'end',
    header: 'Game finished',
    message: 'The game has ended, do you want to start a new one?',
    accept: () => {
      router.push('/games')
    },
  });
};
</script>