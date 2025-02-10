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
    <span class="text-3xl">History</span>
    <span class="inline-flex gap-1">
      <NuxtLink to="/games/new">
          <Button severity="contrast" variant="text" icon="pi pi-play" />
      </NuxtLink>
    </span>
  </h1>

  <DataTable
    :value="games"
    v-model:expandedRows="expandedRows"
    dataKey="uuid"
    sortField="createdAtTime"
    :sortOrder="-1"
    removableSort
    class="-mx-6"
    size="small"
  >
    <template #empty> Currently no played games. </template>
    <Column expander class="w-1" />

    <Column field="name" header="Name" sortable></Column>
    <Column header="Duration">
      <template #body="{ data }">
        {{ formattedDuration(data.createdAt, data.endedAt) }}
      </template>
    </Column>
    <Column field="createdAtTime" header="Date" sortable>
      <template #body="{ data }">
        {{ moment(data.createdAt).fromNow() }}
      </template>
    </Column>
    <Column class="w-8">
      <template #body="{ data }">
        <Button icon="pi pi-replay" severity="primary" variant="text" rounded aria-label="Replay" @click="handleReplayGame(data)"/>
      </template>
    </Column>

    <template #expansion="slotProps">
      <div class="p-4">
        <DataTable size="small" :value="slotProps.data.scores" removableSort sortField="rank" :sortOrder="1">
          <Column field="rank" header="Rank" sortable>
            <template #body="{ data }">
              {{ data.rank }} <i v-if="data.rank === 1" class="pi pi-trophy text-xs"></i>
            </template>
          </Column>
          <Column field="player" header="Player" #body="{ data }">
            {{ data.player.name }}
          </Column>
          <Column field="score" header="Score" />
        </DataTable>
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import moment from 'moment';
import type {Game} from "~/types/global";

const roomStore = useRoomStore();
const expandedRows = ref({});
const router = useRouter();

const games = computed(() => roomStore.games.map(game => ({
  ...game,
  createdAtTime: new Date(game.createdAt).getTime(),
})));

const formattedDuration = (start: Date, end: Date) => {
  const duration = moment.duration(moment(end).diff(moment(start)));

  const days = Math.floor(duration.asDays());
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  return days > 0
      ? `${days}j ${hours}h ${minutes}m`
      : hours > 0
          ? `${hours}h ${minutes}m`
          : minutes > 0
              ? `${minutes}m`
              : `${seconds}s`;
};

const handleReplayGame = (game: Game) => {
  roomStore.startGame(
      game.name,
      game.startScore,
      game.endingScore,
      game.winCondition,
      game.lowestPossibleScore
  );

  router.push('/game');
}
</script>

<style scoped>

</style>