<template>
  <div v-if="roomStore.currentGame" :class="isDuelModeActive ? 'flex flex-col h-full' : ''">
    <ConfirmDialog group="confirm" class="max-w-96 w-[calc(100%-6rem)]">
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
          <div class="rounded-full bg-orange-500 text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20">
            <i class="pi pi-exclamation-circle text-5xl"></i>
          </div>
          <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
          <p class="mb-0">{{ message.message }}</p>
          <div class="flex items-center gap-2 mt-6">
            <Button severity="contrast" :label="t('common.confirm')" @click="acceptCallback"></Button>
            <Button severity="secondary" :label="t('common.cancel')" outlined @click="rejectCallback"></Button>
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
            <Button size="large" icon="pi pi-times" severity="danger" variant="text" rounded :aria-label="t('common.cancel')" @click="confirm.close()" />
          </div>
          <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
          <p class="mb-0">{{ message.message }}</p>
          <div class="flex items-center gap-2 mt-6">
            <Button severity="contrast" :label="t('game.reset')" @click="acceptCallback"></Button>
            <Button severity="secondary" :label="t('common.cancel')" outlined @click="rejectCallback"></Button>
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
                :label="t('common.yes')"
                @click="acceptCallback"
                :style="endGameYesButtonStyle"
            ></Button>
            <Button
                :label="t('common.no')"
                outlined
                :style="endGameNoButtonStyle"
                @click="rejectCallback"
            ></Button>
          </div>
        </div>
      </template>
    </ConfirmDialog>
    <Dialog v-model:visible="isGameInfoDialogOpened" :header="roomStore.currentGame.name" class="max-w-96 w-[calc(100%-6rem)]" :modal="true" :draggable="false" close-on-escape>
      <GameInfo :game="roomStore.currentGame" />
    </Dialog>

    <Menu ref="gameMenu" :model="gameMenuItems" popup/>

    <h1 class="mb-6 flex justify-between items-center">
      <span class="text-3xl truncate w-full pr-2">{{ roomStore.currentGame.name }}</span>
      <span class="inline-flex gap-2">
      <Button @click="handleEndGame" raised severity="contrast" icon="pi pi-stop" />
      <Button @click="toggleGameMenu" raised severity="contrast" icon="pi pi-ellipsis-v" :aria-label="t('common.menu')" />
    </span>
    </h1>

    <div class="flex flex-col gap-4" :class="isDuelModeActive ? 'flex-1 min-h-0' : ''">
      <GamePlayerDuelCounterCard v-if="isDuelModeActive"/>
      <GamePlayerCounterCard v-else/>
    </div>
  </div>
</template>

<script setup lang="ts">
const {t} = useI18n();
const roomStore = useRoomStore();
const confirm = useConfirm();
const router = useRouter();
const user = useSupabaseUser();
const {syncGame} = useSupabaseSync();
const isGameInfoDialogOpened = ref(false);

const gameMenu = ref();
const gameMenuItems = computed(() => [
  {
    label: t('game.info'),
    icon: 'pi pi-info',
    command: () => {
      isGameInfoDialogOpened.value = true;
    }
  },
  {
    label: t('game.reset'),
    icon: 'pi pi-replay',
    command: () => {
      handleResetGame();
    }
  }
]);

const toggleGameMenu = (event: Event) => {
  gameMenu.value.toggle(event);
};

const {isEnabled: isDuelModeEnabled} = useDuelMode();
const isDuelModeActive = computed(() => isDuelModeEnabled.value && roomStore.players.length === 2);

if (roomStore.currentGame === null) {
  router.push('/games');
}

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
    header: t('game.confirmTitle'),
    message: t('game.endGameMessage'),
    accept: () => {
      handleGameFinished();
    },
  });
};

const handleResetGame = () => {
  confirm.require({
    group: 'reset',
    header: t('game.resetOrCancelTitle'),
    message: t('game.resetOrCancelMessage'),
    accept: () => {
      roomStore.resetGame();
    },
    reject: () => {
      roomStore.cancelGame();
      router.push('/games')
    }
  });
};

const finishGame = () => {
  const game = roomStore.currentGame;
  roomStore.endGame();

  if (game && user.value) {
    syncGame(game).catch(() => {});
  }
};

const handleGameFinished = () => {
  if (!roomStore.winners) return;

  const endMessage = roomStore.winners.length > 1
    ? t('game.tie')
    : t('game.hasWon', {name: roomStore.winners[0].player.name});

  confirm.require({
    group: 'end',
    header: endMessage,
    message: t('game.startNewGame'),
    accept: () => {
      finishGame();
      router.push('/games')
    },
    reject: () => {
      finishGame();
      router.push('/rooms')
    }
  });
};
</script>