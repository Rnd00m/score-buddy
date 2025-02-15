<template>
  <div>
    <Toast position="top-center" class="max-w-[calc(100%-2rem)]"/>
    <ConfirmDialog group="delete" class="max-w-96 w-[calc(100%-6rem)]">
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
          <div class="rounded-full bg-red-500 text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20">
            <i class="pi pi-trash text-5xl"></i>
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
      <span class="text-3xl">Room</span>
      <span class="inline-flex gap-2">
        <Button raised severity="danger" icon="pi pi-trash" :disabled="roomStore.players.length === 0" @click="handleDeleteRoom" />
        <Button raised severity="contrast" icon="pi pi-undo" :disabled="roomStore.players.length === 0" @click="handleResetRoom" />
        <NuxtLink to="/rooms/players/add">
            <Button raised severity="contrast" icon="pi pi-user-plus" />
        </NuxtLink>
      </span>
    </h1>

    <DataTable
        :value="roomStore.players"
        v-model:expandedRows="expandedRows"
        dataKey="uuid"
        sortField="score"
        :sortOrder="-1"
        removableSort
        class="-mx-6"
        size="small"
    >
      <template #empty> Currently no players. </template>
      <Column expander class="w-1" v-if="roomStore.games.length"/>
      <Column field="name" header="Player" sortable>
        <template #body="slotProps">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-md" :style="{background: `${slotProps.data.color.value}`}"></div>
            &nbsp;
            {{ slotProps.data.name }}
          </div>
        </template>
      </Column>
      <Column field="score" header="Score" sortable></Column>
      <Column class="w-8">
        <template #body="{ data }">
          <Button icon="pi pi-times" @click="handleRemovePlayer(data.uuid)" severity="danger" size="small" />
        </template>
      </Column>
      <template #expansion="slotProps">
        <div class="p-4">
          <DataTable size="small" :value="userGamesScores(slotProps.data)" removableSort sortField="createdAtTime" :sortOrder="-1">
            <Column field="name" header="Game" />
            <Column header="Rank" >
              <template #body="{ data }">
                {{ data.rank }} <i v-if="data.rank === 1" class="pi pi-trophy text-xs"></i>
              </template>
            </Column>
            <Column field="finalScore" header="Points" />
            <Column field="createdAtTime" header="Date" sortable>
              <template #body="{ data }">
                {{ moment(data.createdAt).fromNow() }}
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </DataTable>
  </div>

</template>

<script setup lang="ts">
import type { Player } from "~/types/global";
import moment from 'moment';

const roomStore = useRoomStore();
const confirm = useConfirm();
const toast = useToast();
const expandedRows = ref({});

const handleRemovePlayer = (playerUuid: string) => {
  if (roomStore.currentGame !== null) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'You can\'t remove player while a game is in progress.', life: 4000 });
    return;
  }

  confirm.require({
    group: 'remove',
    header: 'Confirmation',
    message: 'Are you sure you want to remove this player?',
    accept: () => {
      roomStore.removePlayer(playerUuid);
    },
  });
};

const handleDeleteRoom = () => {
  confirm.require({
    group: 'delete',
    header: 'Confirmation',
    message: 'Are you sure you want to remove the lobby? All players will be deleted and all games will be lost.',
    accept: () => {
      roomStore.deleteRoom();
    },
  });
};

const handleResetRoom = () => {
  confirm.require({
    group: 'reset',
    header: 'Confirmation',
    message: 'Are you sure you want to reset the lobby? All games will be lost.',
    accept: () => {
      roomStore.resetRoom();
    },
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

</style>