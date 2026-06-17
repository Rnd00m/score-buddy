<template>
  <DataTable
    class="flex-1 min-h-0 -mx-6 -mb-6"
    :value="games"
    v-model:expandedRows="expandedRows"
    @row-click="onRowClick"
    dataKey="uuid"
    sortField="createdAtTime"
    :sortOrder="-1"
    removableSort
    scrollable
    scrollHeight="flex"
    size="small"
    :loading="loading"
    :paginator="paginator"
    :rows="10"
    :rowsPerPageOptions="[10, 20, 50]"
  >
    <template #empty>{{ emptyMessage ?? t('gameHistoryTable.noPlayedGames') }}</template>
    <Column expander class="w-1" />

    <Column field="name" :header="t('gameHistoryTable.name')" sortable></Column>
    <Column :header="t('gameHistoryTable.duration')">
      <template #body="{ data }">
        {{ formattedDuration(data.createdAt, data.endedAt) }}
      </template>
    </Column>
    <Column field="createdAtTime" :header="t('gameHistoryTable.date')" sortable>
      <template #body="{ data }">
        {{ fromNow(data.createdAt) }}
      </template>
    </Column>
    <Column v-if="showReplayColumn" class="w-8">
      <template #body="{ data }">
        <Button icon="pi pi-replay" severity="primary" size="small" :aria-label="t('gameHistoryTable.replay')" @click="emit('replay', data)"/>
      </template>
    </Column>

    <template #expansion="slotProps">
      <DataTable size="small" :value="slotProps.data.scores" removableSort sortField="rank" :sortOrder="1">
        <Column field="rank" :header="t('gameHistoryTable.rank')" sortable>
          <template #body="{ data }">
            {{ data.rank }} <i v-if="data.rank === 1" class="pi pi-trophy text-xs"></i>
          </template>
        </Column>
        <Column field="player" :header="t('gameHistoryTable.player')" #body="{ data }">
          {{ data.player.name }}
        </Column>
        <Column field="score" :header="t('gameHistoryTable.score')" />
      </DataTable>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import type {Game} from "~/types/global";

const {t} = useI18n();
const {fromNow, formattedDuration} = useDateFormat();

withDefaults(defineProps<{
  games: (Game & { createdAtTime: number })[];
  loading?: boolean;
  emptyMessage?: string;
  paginator?: boolean;
  showReplayColumn?: boolean;
}>(), {
  loading: false,
  paginator: true,
  showReplayColumn: true,
});

const emit = defineEmits<{
  replay: [game: Game & { createdAtTime: number }];
}>();

const { expandedRows, onRowClick } = useExpandableRow('uuid');
</script>

<style scoped>
:deep(td:has(.p-datatable)) {
  padding: 0;
}
</style>