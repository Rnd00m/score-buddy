<template>
  <div class="relative flex-1 min-h-0 -mb-6">
    <DataTable
      ref="tableRef"
      class="h-full -mx-6"
      :value="games"
      v-model:expandedRows="expandedRows"
      v-model:sortField="sortField"
      v-model:sortOrder="sortOrder"
      @row-click="onRowClick"
      dataKey="uuid"
      removableSort
      scrollable
      scrollHeight="flex"
      size="large"
      :loading="loading"
      :paginator="isScrubberActive ? false : paginator"
      :rows="10"
      :rowsPerPageOptions="[10, 20, 50]"
    >
      <template #empty>{{ emptyMessage ?? t('gameHistoryTable.noPlayedGames') }}</template>
      <Column expander class="w-1 pe-0" />

      <Column field="name" :header="t('gameHistoryTable.name')" sortable>
        <template #body="{ data }">
          <span class="break-all">{{ data.name }}</span>
        </template>
      </Column>
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
          <Button severity="primary" size="small" :aria-label="t('gameHistoryTable.replay')" @click="emit('replay', data)">
            <template #icon><Replay :size="16"/></template>
          </Button>
        </template>
      </Column>

      <template #expansion="slotProps">
        <template v-if="(slotProps.data.rounds?.length ?? 0) > 1">
          <div v-for="(round, index) in slotProps.data.rounds" :key="index" class="mb-2 last:mb-0">
            <span class="text-sm font-semibold px-2">{{ t('gameHistoryTable.round', { number: Number(index) + 1 }) }}</span>
            <GameRoundScoresTable :scores="round.scores" />
          </div>
        </template>
        <GameRoundScoresTable v-else :scores="slotProps.data.scores" />
      </template>
    </DataTable>

    <BaseDateScrollIndex
      v-if="isScrubberActive && isDateSorted"
      :dates="sortedDates"
      :container="scrollContainer"
    />
  </div>
</template>

<script setup lang="ts">
import type {Game} from "~/types/global";
import Replay from '@primeicons/vue/replay';

const {t} = useI18n();
const {fromNow, formattedDuration} = useDateFormat();

const props = withDefaults(defineProps<{
  games: (Game & { createdAtTime: number })[];
  loading?: boolean;
  emptyMessage?: string;
  paginator?: boolean;
  showReplayColumn?: boolean;
  enableDateScrubber?: boolean;
}>(), {
  loading: false,
  paginator: true,
  showReplayColumn: true,
  enableDateScrubber: false,
});

const emit = defineEmits<{
  replay: [game: Game & { createdAtTime: number }];
}>();

const { expandedRows, onRowClick } = useExpandableRow('uuid');

const isMobileDevice = useIsMobileDevice();
const isScrubberActive = computed(() => props.enableDateScrubber && isMobileDevice.value);

const sortField = ref('createdAtTime');
const sortOrder = ref<1 | -1>(-1);

// The side date scrubber only makes sense while rows are ordered by date —
// sorting by name/duration breaks the position-to-date mapping it relies on.
const isDateSorted = computed(() => sortField.value === 'createdAtTime');

const sortedDates = computed(() => {
  const direction = sortOrder.value === 1 ? 1 : -1;

  return [...props.games]
    .sort((a, b) => (a.createdAtTime - b.createdAtTime) * direction)
    .map(game => game.createdAt);
});

const tableRef = ref();
const scrollContainer = ref<HTMLElement | null>(null);

onMounted(async () => {
  await nextTick();
  scrollContainer.value = tableRef.value?.$el?.querySelector('.p-datatable-table-container') ?? null;
});
</script>

<style scoped>
:deep(td:has(.p-datatable)) {
  padding: 0;
}
</style>