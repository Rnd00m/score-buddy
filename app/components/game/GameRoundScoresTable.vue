<template>
  <DataTable size="large" :value="scores" removableSort sortField="rank" :sortOrder="1">
    <Column field="rank" :header="t('gameHistoryTable.rank')" sortable>
      <template #body="{ data }">
        {{ data.rank }} <Trophy v-if="data.rank === 1" :size="12"/>
      </template>
    </Column>
    <Column field="player" :header="t('gameHistoryTable.player')" #body="{ data }">
      {{ data.player.name }}
    </Column>
    <Column field="score" :header="t('gameHistoryTable.score')" />
  </DataTable>
</template>

<script setup lang="ts">
import type {GameScore} from "~/types/global";
import Trophy from '@primeicons/vue/trophy';

const {t} = useI18n();

defineProps<{
  scores: GameScore[];
}>();
</script>
