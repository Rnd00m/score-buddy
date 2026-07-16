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
    size="large"
    :loading="loading"
    :paginator="paginator"
    :rows="10"
    :rowsPerPageOptions="[10, 20, 50]"
  >
    <template #empty>{{ emptyMessage ?? t('gameHistoryTable.noPlayedGames') }}</template>
    <Column expander class="w-1 pe-0" />

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
      <template v-if="(slotProps.data.rounds?.length ?? 0) > 1">
        <div v-for="(round, index) in slotProps.data.rounds" :key="index" class="mb-2 last:mb-0">
          <span class="text-sm font-semibold px-2">{{ t('gameHistoryTable.round', { number: index + 1 }) }}</span>
          <GameRoundScoresTable :scores="round.scores" />
        </div>
      </template>
      <GameRoundScoresTable v-else :scores="slotProps.data.scores" />
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