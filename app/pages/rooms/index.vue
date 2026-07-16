<template>
  <div class="flex flex-col h-full">
    <Toast position="top-center" class="max-w-[calc(100%-2rem)]"/>
    <ConfirmDialog group="remove" class="max-w-96 w-[calc(100%-6rem)]" dismissableMask>
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

    <ConfirmDialog group="end" class="max-w-96 w-[calc(100%-6rem)]" dismissableMask>
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
          <div class="rounded-full bg-red-500 text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20">
            <i class="pi pi-stop-circle text-5xl"></i>
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

    <ConfirmDialog group="firstPlayer" class="max-w-96 w-[calc(100%-6rem)]" dismissableMask>
      <template #container="{ message, acceptCallback }" v-if="firstPlayer">
        <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
          <div
              class="rounded-full bg-primary text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20"
              :style="firstPlayerIconStyle"
          >
            <i class="pi pi-star-fill text-5xl"></i>
          </div>
          <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
          <p class="mb-0">{{ message.message }}</p>
          <div class="flex items-center gap-2 mt-6">
            <Button severity="contrast" :label="t('common.continue')" @click="acceptCallback"></Button>
          </div>
        </div>
      </template>
    </ConfirmDialog>

    <Dialog v-model:visible="isDiceDialogOpened" :header="t('room.rollDice')" class="max-w-96 w-[calc(100%-6rem)]" :modal="true" :draggable="false" close-on-escape dismissable-mask>
      <div class="flex flex-col gap-4">
        <div v-for="(die, index) in diceGroups" :key="index" class="flex items-center gap-2">
          <InputNumber
            v-model="die.count"
            :min="1"
            :max="20"
            showButtons
            buttonLayout="horizontal"
            :step="1"
            inputClass="w-14 text-center"
            :aria-label="t('room.diceCount')"
          >
            <template #incrementicon><span class="pi pi-plus" /></template>
            <template #decrementicon><span class="pi pi-minus" /></template>
          </InputNumber>
          <span>d</span>
          <InputNumber
            v-model="die.sides"
            :min="2"
            :max="1000"
            showButtons
            buttonLayout="horizontal"
            :step="1"
            inputClass="w-16 text-center"
            :aria-label="t('room.diceSides')"
          >
            <template #incrementicon><span class="pi pi-plus" /></template>
            <template #decrementicon><span class="pi pi-minus" /></template>
          </InputNumber>
          <Button
            icon="pi pi-times"
            severity="danger"
            size="small"
            text
            :aria-label="t('common.cancel')"
            :disabled="diceGroups.length === 1"
            @click="removeDiceGroup(index)"
          />
        </div>

        <Button :label="t('room.addDie')" icon="pi pi-plus" severity="secondary" outlined @click="addDiceGroup" />
        <Button :label="t('room.roll')" icon="pi pi-play" severity="contrast" @click="handleRollDice" />

        <div v-if="diceResults.length" class="flex flex-col gap-1 border-t border-surface-200 dark:border-surface-700 pt-4">
          <div v-for="(result, index) in diceResults" :key="index">
            {{ result.count }}d{{ result.sides }}: {{ result.rolls.join(', ') }} <span v-if="result.rolls.length > 1">= <strong>{{ result.total }}</strong></span>
          </div>
          <div v-if="diceResults.length > 1" class="font-bold mt-1">
            {{ t('room.diceGrandTotal') }}: {{ diceGrandTotal }}
          </div>
        </div>
      </div>
    </Dialog>

    <Menu ref="roomMenu" :model="roomMenuItems" popup class="mt-2"/>

    <h1 class="mb-6 flex justify-between items-center shrink-0">
      <span class="text-3xl">{{ t('room.title') }}</span>
      <span class="inline-flex gap-2">
        <Button raised severity="danger" icon="pi pi-times" :disabled="roomStore.players.length === 0" @click="handleEndRoom" />
        <NuxtLink to="/rooms/players/add">
            <Button raised severity="contrast" icon="pi pi-user-plus" />
        </NuxtLink>
        <Button raised severity="contrast" icon="pi pi-ellipsis-v" :aria-label="t('common.menu')" @click="toggleRoomMenu" />
      </span>
    </h1>

    <DataTable
      class="flex-1 min-h-0 -mx-6 -mb-6"
      :value="roomStore.players"
      v-model:expandedRows="expandedRows"
      @row-click="onRowClick"
      dataKey="uuid"
      sortField="score"
      :sortOrder="-1"
      removableSort
      scrollable
      scrollHeight="flex"
      size="large"
    >
      <template #empty> {{ t('room.noPlayers') }} </template>
      <Column expander class="w-1 pe-0"/>
      <Column field="name" :header="t('room.player')" sortable>
        <template #body="slotProps">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-md" :style="{background: `${slotProps.data.color.value}`}"></div>
            &nbsp;
            {{ slotProps.data.name }}
          </div>
        </template>
      </Column>
      <Column field="score" :header="t('room.score')" sortable></Column>
      <Column class="w-8">
        <template #body="{ data }">
          <Button icon="pi pi-times" @click="handleRemovePlayer(data.uuid)" severity="danger" size="small" />
        </template>
      </Column>
      <template #expansion="slotProps">
        <DataTable size="large" :value="userGamesScores(slotProps.data)" removableSort sortField="createdAtTime" :sortOrder="-1">
          <template #empty>{{ t('room.noCompletedGames') }}</template>
          <Column field="name" :header="t('room.game')" />
          <Column :header="t('room.rank')" >
            <template #body="{ data }">
              {{ data.rank }} <i v-if="data.rank === 1" class="pi pi-trophy text-xs"></i>
            </template>
          </Column>
          <Column field="finalScore" :header="t('room.points')" />
          <Column field="createdAtTime" :header="t('room.date')" sortable>
            <template #body="{ data }">
              {{ fromNow(data.createdAt) }}
            </template>
          </Column>
        </DataTable>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import type { Player } from "~/types/global";

const {t} = useI18n();
const {fromNow} = useDateFormat();
const router = useRouter();
const roomStore = useRoomStore();
const confirm = useConfirm();
const toast = useToast();
const { expandedRows, onRowClick } = useExpandableRow('uuid');

const roomMenu = ref();
const roomMenuItems = computed(() => [
  {
    label: t('room.determineFirstPlayer'),
    icon: 'pi pi-star',
    disabled: roomStore.players.length < 2,
    command: () => {
      handleDetermineFirstPlayer();
    }
  },
  {
    label: t('room.rollDice'),
    icon: 'pi pi-box',
    command: () => {
      isDiceDialogOpened.value = true;
    }
  },
  {
    label: t('room.timer'),
    icon: 'pi pi-stopwatch',
    command: () => {
      router.push('/rooms/timer');
    }
  },
  {
    label: t('room.resetLobby'),
    icon: 'pi pi-eraser',
    disabled: roomStore.players.length === 0,
    command: () => {
      handleResetRoom();
    }
  }
]);

const toggleRoomMenu = (event: Event) => {
  roomMenu.value.toggle(event);
};

const firstPlayer = ref<Player | null>(null);

const firstPlayerIconStyle = computed(() => {
  if (!firstPlayer.value) return {};

  const playerColor = firstPlayer.value.color.value;

  return {
    background: playerColor,
    color: getTextColorContrasted(playerColor)
  }
});

const handleDetermineFirstPlayer = () => {
  const players = roomStore.players;
  firstPlayer.value = players[Math.floor(Math.random() * players.length)] ?? null;

  if (!firstPlayer.value) return;

  confirm.require({
    group: 'firstPlayer',
    header: t('room.firstPlayerTitle'),
    message: t('room.firstPlayerMessage', { name: firstPlayer.value.name }),
    accept: () => {
      router.push('/');
    },
  });
};

const handleRemovePlayer = (playerUuid: string) => {
  if (roomStore.currentGame !== null) {
    toast.add({ severity: 'error', summary: t('common.error'), detail: t('room.cantRemovePlayer'), life: 4000 });
    return;
  }

  confirm.require({
    group: 'remove',
    header: t('room.confirmation'),
    message: t('room.removePlayerMessage'),
    accept: () => {
      roomStore.removePlayer(playerUuid);
    },
  });
};

const handleEndRoom = () => {
  confirm.require({
    group: 'end',
    header: t('room.endRoomTitle'),
    message: t('room.endRoomMessage'),
    accept: () => {
      roomStore.deleteRoom();
    },
  });
};

const handleResetRoom = () => {
  confirm.require({
    group: 'reset',
    header: t('room.confirmation'),
    message: t('room.resetRoomMessage'),
    accept: () => {
      roomStore.resetRoom();
    },
  });
};

interface DiceGroup {
  count: number;
  sides: number;
}

interface DiceRollResult extends DiceGroup {
  rolls: number[];
  total: number;
}

const isDiceDialogOpened = ref(false);
const diceGroups = ref<DiceGroup[]>([{ count: 1, sides: 6 }]);
const diceResults = ref<DiceRollResult[]>([]);

const diceGrandTotal = computed(() => diceResults.value.reduce((sum, result) => sum + result.total, 0));

const addDiceGroup = () => {
  diceGroups.value.push({ count: 1, sides: 6 });
};

const removeDiceGroup = (index: number) => {
  if (diceGroups.value.length === 1) return;

  diceGroups.value.splice(index, 1);
};

const handleRollDice = () => {
  diceResults.value = diceGroups.value.map((die) => {
    const rolls = Array.from({ length: die.count }, () => Math.floor(Math.random() * die.sides) + 1);

    return {
      count: die.count,
      sides: die.sides,
      rolls,
      total: rolls.reduce((sum, roll) => sum + roll, 0)
    };
  });
};

interface PlayerGameScore {
  name: string;
  finalScore: number;
  rank: number;
  createdAt: Date;
}

interface PlayerGameScoreWithTime extends PlayerGameScore {
  createdAtTime: number;
}

const userGamesScores = (player: Player): PlayerGameScore[] => {
  return roomStore.games.reduce((acc: PlayerGameScoreWithTime[], game) => {
    const score = game.scores.find((score) => score.player.uuid === player.uuid);
    if (score) acc.push({
      name: game.name,
      finalScore: score.score,
      rank: score.rank,
      createdAt: game.createdAt,
      createdAtTime: new Date(game.createdAt).getTime(),
    });
    return acc;
  }, []);
}
</script>

<style scoped>
:deep(td:has(.p-datatable)) {
  padding: 0;
}
</style>