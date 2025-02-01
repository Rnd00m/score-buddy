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
  <ConfirmDialog group="reset" class="max-w-96 w-[calc(100%-6rem)]">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded relative">
        <div class="rounded-full bg-orange-500 text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20">
          <i class="pi pi-exclamation-circle text-5xl"></i>
        </div>
        <div class="absolute top-1 right-1">
          <Button size="large" icon="pi pi-times" severity="danger" variant="text" rounded aria-label="Cancel" @click="confirm.close()" />
        </div>
        <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
        <p class="mb-0">{{ message.message }}</p>
        <div class="flex items-center gap-2 mt-6">
          <Button severity="contrast" label="Reset" @click="acceptCallback"></Button>
          <Button severity="secondary" label="Cancel" outlined @click="rejectCallback"></Button>
        </div>
      </div>
    </template>
  </ConfirmDialog>
  <ConfirmDialog group="end" class="max-w-96 w-[calc(100%-6rem)]">
    <template #container="{ message, acceptCallback, rejectCallback }" v-if="roomStore.winners">
      <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
        <div
          class="rounded-full bg-primary text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20"
          :style="endGameIconStyle"
        >
          <i class="pi pi-trophy text-5xl"></i>
        </div>
        <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
        <p class="mb-0">{{ message.message }}</p>
        <div class="flex items-center gap-2 mt-6">
          <Button
            label="Yes"
            @click="acceptCallback"
            :style="endGameYesButtonStyle"
          ></Button>
          <Button
            label="No"
            outlined
            :style="endGameNoButtonStyle"
            @click="rejectCallback"
          ></Button>
        </div>
      </div>
    </template>
  </ConfirmDialog>

  <h1 class="mb-6 flex justify-between items-center">
    <span class="text-3xl">Game</span>
    <span class="inline-flex gap-1">
      <Button @click="handleResetGame" variant="text" severity="danger" icon="pi pi-replay" />
      <Button @click="handleEndGame" variant="text" severity="contrast" icon="pi pi-stop" />
    </span>
  </h1>

  <div class="flex flex-col gap-4">
    <GamePlayerCounterCard/>
  </div>
</template>

<script setup lang="ts">
const roomStore = useRoomStore();
const confirm = useConfirm();
const router = useRouter();

const endGameIconStyle = computed(() => {
  if (!roomStore.winners || roomStore.winners.length > 1) return {};

  const winnerColor = roomStore.winners[0].player.color.value;

  return {
    background: winnerColor,
    color: getTextColorContrasted(winnerColor)
  }
});

const endGameYesButtonStyle = computed(() => {
  if (!roomStore.winners || roomStore.winners.length > 1) return {};

  const winnerColor = roomStore.winners[0].player.color.value;

  return {
    background: winnerColor,
    color: getTextColorContrasted(winnerColor),
    borderColor: winnerColor
  }
});
const endGameNoButtonStyle = computed(() => {
  if (!roomStore.winners || roomStore.winners.length > 1) return {};

  const winnerColor = roomStore.winners[0].player.color.value;

  return {
    color: winnerColor,
    borderColor: winnerColor
  }
});

watch(
  () => roomStore.isGameFinished,
  (isGameFinished) => {
    if (isGameFinished) {
      handleGameFinished();
    }
  }
);

const handleEndGame = () => {
  confirm.require({
    group: 'confirm',
    header: 'Are you sure?',
    message: "You're about to end the game.",
    accept: () => {
      handleGameFinished();
    },
  });
};

const handleResetGame = () => {
  confirm.require({
    group: 'reset',
    header: 'Reset or cancel?',
    message: "Do you want to reset (all points will be set to min score) or cancel (game will be deleted no winner will be declared) the game ?",
    accept: () => {
      roomStore.resetGame();
    },
    reject: () => {
      roomStore.cancelGame();
      router.push('/games')
    }
  });
};

const handleGameFinished = () => {
  if (!roomStore.winners) return;

  const endMessage = roomStore.winners.length > 1
    ? 'It\'s a tie!'
    : roomStore.winners[0].player.name + ' has won!';

  confirm.require({
    group: 'end',
    header: endMessage,
    message: 'Do you want to start a new one?',
    accept: () => {
      roomStore.endGame();
      router.push('/games')
    },
    reject: () => {
      roomStore.endGame();
      router.push('/rooms')
    }
  });
};
</script>