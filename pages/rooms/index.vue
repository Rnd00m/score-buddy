<template>
  <Toast position="top-center" class="max-w-[calc(100%-2rem)]"/>
  <ConfirmDialog group="remove" class="max-w-96 w-[calc(100%-6rem)]">
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
    <NuxtLink to="/rooms/players/add">
      <Button severity="contrast" rounded icon="pi pi-user-plus" />
    </NuxtLink>
  </h1>

  <DataTable :value="roomStore.players" v-model:expandedRows="expandedRows" dataKey="uuid" sortField="score" :sortOrder="-1" removableSort class="-mx-6">
    <template #empty> Currently no players. </template>
    <Column expander class="w-1" />
    <Column field="name" header="Player">
      <template #body="slotProps">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-md" :style="{background: `${slotProps.data.color.value}`}"></div>
          &nbsp;
          {{ slotProps.data.name }}
        </div>
      </template>
    </Column>
    <Column field="score" header="Score" sortable ></Column>
    <Column class="w-8">
      <template #body="{ data }">
        <Button icon="pi pi-times" @click="handleRemovePlayer(data.uuid)" severity="danger" variant="text" rounded aria-label="Cancel" />
      </template>
    </Column>
    <template #expansion="slotProps">
      <div class="p-4">
        <DataTable :value="userGamesScores(slotProps.data)" removableSort sortField="createdAt" :sortOrder="-1">
          <Column field="name" header="Game" />
          <Column header="Rank" >
            <template #body="{ data }">
              {{ data.rank }} <i v-if="data.rank === 1" class="pi pi-trophy text-xs"></i>
            </template>
          </Column>
          <Column field="finalScore" header="Points" />
          <Column field="createdAt" header="Date" sortable>
            <template #body="{ data }">
              {{ moment(data.createdAt).fromNow() }}
            </template>
          </Column>
        </DataTable>
      </div>
    </template>
  </DataTable>
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

interface PlayerGameScore {
  name: string;
  finalScore: number;
  rank: number;
  createdAt: Date;
}

const userGamesScores = (player: Player): PlayerGameScore[] => {
  return roomStore.games.reduce((acc: PlayerGameScore[], game) => {
    const score = game.scores.find((score) => score.player.uuid === player.uuid);
    if (score) acc.push({
      name: game.name,
      finalScore: score.score,
      rank: score.rank,
      createdAt: game.createdAt
    });
    return acc;
  }, []);
}
</script>

<style scoped>

</style>