<template>
  <Toast position="top-center" class="max-w-[calc(100%-2rem)]"/>

  <ConfirmDialog group="newGame" class="max-w-96 w-[calc(100%-6rem)]" dismissableMask>
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
        <div class="rounded-full bg-primary text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20">
          <i class="pi pi-question text-5xl"></i>
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

  <DataTable
    size="large"
    :value="gameTypes"
    @rowSelect="handleGameSelected"
    selectionMode="single"
    scrollable
    removableSort
    scrollHeight="16rem"
    class="w-screen"
  >
    <Column field="name" :header="t('gameTypesTable.game')" sortable frozen />
    <Column field="startScore" :header="t('gameTypesTable.start')">
      <template #body="slotProps">
        <Tag severity="contrast">{{ slotProps.data.startScore }}</Tag>
      </template>
    </Column>
    <Column field="endingScore" :header="t('gameTypesTable.ending')">
      <template #body="slotProps">
        <Tag severity="contrast" v-if="slotProps.data.endingScore">
          {{ slotProps.data.endingScore }}
        </Tag>
        <Tag severity="secondary" v-else>
          {{ t('gameTypesTable.manual') }}
        </Tag>
      </template>
    </Column>
    <Column field="lowestPossibleScore" :header="t('gameTypesTable.lowest')">
      <template #body="slotProps">
        <Tag severity="contrast" v-if="slotProps.data.lowestPossibleScore">
          {{ slotProps.data.lowestPossibleScore }}
        </Tag>
        <Tag severity="secondary" v-else>
          {{ t('gameTypesTable.no') }}
        </Tag>
      </template>
    </Column>
    <Column field="winCondition" :header="t('gameTypesTable.win')">
      <template #body="slotProps">
        <Tag :severity="slotProps.data.winCondition === WinCondition.MostPoints ? 'contrast' : 'secondary'">
          {{ t(`winCondition.${slotProps.data.winCondition}`) }}
        </Tag>
      </template>
    </Column>
  </DataTable>
</template>

<script lang="ts" setup>
import {type Game, WinCondition} from "~/types/global";

const {t} = useI18n();
const roomStore = useRoomStore();
const router = useRouter();
const confirm = useConfirm();

const gameTypes = computed(() => {
  return roomStore.games.filter((game, index, self) =>
      index === self.findIndex((g) =>
          g.name === game.name &&
          g.startScore === game.startScore &&
          g.endingScore === game.endingScore &&
          g.lowestPossibleScore === game.lowestPossibleScore &&
          g.winCondition === game.winCondition &&
          (g.winningRounds ?? 1) === (game.winningRounds ?? 1)
      )
  );
})

const handleGameSelected = (event: {data: Game}) => {
  confirm.require({
    group: 'newGame',
    header: t('gameTypesTable.newGameTitle'),
    message: t('gameTypesTable.newGameMessage', {name: event.data.name}),
    accept: () => {
      roomStore.startGame(
          event.data.name,
          event.data.startScore,
          event.data.endingScore,
          event.data.winCondition,
          event.data.lowestPossibleScore,
          event.data.winningRounds ?? 1
      );
      router.push('/game');
    },
  });
}
</script>

<style scoped>

</style>