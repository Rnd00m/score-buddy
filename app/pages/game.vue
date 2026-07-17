<template>
  <div v-if="roomStore.currentGame" :class="isDuelModeActive ? 'flex flex-col h-full' : ''">
    <ConfirmDialog group="confirm" class="max-w-96 w-[calc(100%-6rem)]" dismissableMask>
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
          <div class="rounded-full bg-orange-500 text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20">
            <ExclamationCircle :size="48"/>
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
    <ConfirmDialog group="reset" class="max-w-96 w-[calc(100%-6rem)]" dismissableMask>
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded relative">
          <div class="rounded-full bg-orange-500 text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20">
            <ExclamationCircle :size="48"/>
          </div>
          <div class="absolute top-1 right-1">
            <Button size="large" severity="danger" variant="text" rounded :aria-label="t('common.cancel')" @click="confirm.close()">
              <template #icon><Times :size="20"/></template>
            </Button>
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
    <ConfirmDialog group="end" class="max-w-96 w-[calc(100%-6rem)]" dismissableMask>
      <template #container="{ message, acceptCallback, rejectCallback }" v-if="roomStore.winners">
        <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
          <div
              class="rounded-full bg-primary text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20"
              :style="endGameIconStyle"
          >
            <Trophy :size="48"/>
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
    <ConfirmDialog group="tieNotAllowed" class="max-w-96 w-[calc(100%-6rem)]" dismissableMask>
      <template #container="{ message, acceptCallback }">
        <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
          <div class="rounded-full bg-orange-500 text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20">
            <ExclamationCircle :size="48"/>
          </div>
          <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
          <p class="mb-0">{{ message.message }}</p>
          <div class="flex items-center gap-2 mt-6">
            <Button severity="contrast" :label="t('common.continue')" @click="acceptCallback"></Button>
          </div>
        </div>
      </template>
    </ConfirmDialog>
    <ConfirmDialog group="roundEnd" class="max-w-96 w-[calc(100%-6rem)]" dismissableMask>
      <template #container="{ message, acceptCallback }" v-if="roomStore.winners">
        <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
          <div
              class="rounded-full bg-primary text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20"
              :style="endGameIconStyle"
          >
            <FlagFill :size="48"/>
          </div>
          <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
          <p class="mb-0">{{ message.message }}</p>
          <div class="flex items-center gap-2 mt-6">
            <Button severity="contrast" :label="t('common.continue')" @click="acceptCallback"></Button>
          </div>
        </div>
      </template>
    </ConfirmDialog>

    <Dialog v-model:visible="isGameInfoDialogOpened" :header="roomStore.currentGame.name" class="max-w-96 w-[calc(100%-6rem)]" :modal="true" :draggable="false" close-on-escape dismissable-mask>
      <GameInfo :game="roomStore.currentGame" />
    </Dialog>

    <Menu ref="gameMenu" :model="gameMenuItems" popup class="mt-2"/>

    <h1 class="mb-6 flex justify-between items-center">
      <span class="text-3xl truncate w-full pr-2">{{ roomStore.currentGame.name }}</span>
      <span class="inline-flex gap-2">
      <Button @click="handleUndo" :disabled="!canUndo" raised variant="outlined" severity="secondary" :aria-label="t('common.undo')">
        <template #icon><Undo :size="18"/></template>
      </Button>
      <Button @click="handleRedo" :disabled="!canRedo" raised variant="outlined" severity="secondary" :aria-label="t('common.redo')">
        <template #icon><span class="redo-icon inline-flex"><Undo :size="18"/></span></template>
      </Button>
      <Button @click="handleEndGame" raised severity="contrast">
        <template #icon><Stop :size="18"/></template>
      </Button>
      <Button @click="toggleGameMenu" raised severity="contrast" :aria-label="t('common.menu')">
        <template #icon><EllipsisV :size="18"/></template>
      </Button>
    </span>
    </h1>

    <div class="flex flex-col gap-4" :class="isDuelModeActive ? 'flex-1 min-h-0' : ''">
      <GamePlayerDuelCounterCard v-if="isDuelModeActive"/>
      <GamePlayerCounterCard v-else/>
    </div>
  </div>
</template>

<script setup lang="ts">
import ExclamationCircle from '@primeicons/vue/exclamation-circle';
import Times from '@primeicons/vue/times';
import Trophy from '@primeicons/vue/trophy';
import FlagFill from '@primeicons/vue/flag-fill';
import Undo from '@primeicons/vue/undo';
import Stop from '@primeicons/vue/stop';
import EllipsisV from '@primeicons/vue/ellipsis-v';
import Info from '@primeicons/vue/info';
import Replay from '@primeicons/vue/replay';

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
    icon: Info,
    command: () => {
      isGameInfoDialogOpened.value = true;
    }
  },
  {
    label: t('game.reset'),
    icon: Replay,
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

const {undo, redo, canUndo, canRedo, clear: clearScoreHistory} = useScoreHistory();

const handleUndo = () => {
  const entry = undo();
  if (!entry) return;

  const player = roomStore.players.find(p => p.uuid === entry.playerUuid);
  if (player) roomStore.setScore(player, entry.before);
};

const handleRedo = () => {
  const entry = redo();
  if (!entry) return;

  const player = roomStore.players.find(p => p.uuid === entry.playerUuid);
  if (player) roomStore.setScore(player, entry.after);
};

// A new game (different uuid) or a new round within the same match
// (rounds.length changed) invalidates any in-flight undo/redo history.
watch(
  () => [roomStore.currentGame?.uuid, roomStore.currentGame?.rounds?.length],
  () => clearScoreHistory(),
);

if (roomStore.currentGame === null) {
  router.push('/games');
}

const soleWinner = computed(() => {
  if (!roomStore.winners || roomStore.winners.length > 1) return null;

  return roomStore.winners[0] ?? null;
});

const endGameIconStyle = computed(() => {
  if (!soleWinner.value) return {};

  const winnerColor = soleWinner.value.player.color.value;

  return {
    background: winnerColor,
    color: getTextColorContrasted(winnerColor)
  }
});

const endGameYesButtonStyle = computed(() => {
  if (!soleWinner.value) return {};

  const winnerColor = soleWinner.value.player.color.value;

  return {
    background: winnerColor,
    color: getTextColorContrasted(winnerColor),
    borderColor: winnerColor
  }
});
const endGameNoButtonStyle = computed(() => {
  if (!soleWinner.value) return {};

  const winnerColor = soleWinner.value.player.color.value;

  return {
    color: winnerColor,
    borderColor: winnerColor
  }
});

watch(
  () => roomStore.isGameFinished,
  (isGameFinished) => {
    if (isGameFinished) {
      handleRoundOrGameFinished();
    }
  }
);

const isTieBlocked = computed(() => {
  return roomStore.isWinningRoundsModeEnabled
    && (roomStore.winners?.length ?? 0) > 1;
});

const showTieNotAllowedAlert = () => {
  confirm.require({
    group: 'tieNotAllowed',
    header: t('game.tieNotAllowedTitle'),
    message: t('game.tieNotAllowedMessage'),
    accept: () => {},
  });
};

const handleEndGame = () => {
  if (isTieBlocked.value) {
    showTieNotAllowedAlert();
    return;
  }

  const isRoundEnd = !roomStore.isCurrentRoundDecisive;

  confirm.require({
    group: 'confirm',
    header: t('game.confirmTitle'),
    message: isRoundEnd ? t('game.endRoundMessage') : t('game.endGameMessage'),
    accept: () => {
      handleRoundOrGameFinished();
    },
  });
};

const roundWinsTallyText = computed(() => {
  const tally = roomStore.currentRoundWinsTally;

  return roomStore.players
    .map(player => `${player.name}: ${tally[player.uuid] ?? 0}`)
    .join(' · ');
});

const handleRoundOrGameFinished = () => {
  if (roomStore.isCurrentRoundDecisive) {
    handleGameFinished();
  } else {
    handleRoundFinished();
  }
};

const handleRoundFinished = () => {
  if (!roomStore.winners) return;

  if (isTieBlocked.value) {
    showTieNotAllowedAlert();
    return;
  }

  const header = soleWinner.value
    ? t('game.roundHasWon', {name: soleWinner.value.player.name})
    : t('game.roundTie');

  confirm.require({
    group: 'roundEnd',
    header,
    message: t('game.roundWinsTallyMessage', {tally: roundWinsTallyText.value}),
    accept: () => {
      roomStore.endRound();
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
      clearScoreHistory();
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

  if (isTieBlocked.value) {
    showTieNotAllowedAlert();
    return;
  }

  const endMessage = soleWinner.value
    ? t('game.hasWon', {name: soleWinner.value.player.name})
    : t('game.tie');

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

<style scoped>
:deep(.redo-icon) {
  display: inline-block;
  transform: scaleX(-1);
}
</style>