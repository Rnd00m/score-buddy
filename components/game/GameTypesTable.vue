<template>
  <DataTable :value="gameTypes" removableSort scrollHeight="16rem">
    <Column field="name" header="Name" sortable></Column>
    <Column field="startScore" header="Start">
      <template #body="slotProps">
        <Tag severity="contrast">{{ slotProps.data.startScore }}</Tag>
      </template>
    </Column>
    <Column field="endingScore" header="Ending">
      <template #body="slotProps">
        <Tag severity="contrast" v-if="slotProps.data.endingScore">
          {{ slotProps.data.endingScore }}
        </Tag>
        <Tag severity="secondary" v-else>
          Manual
        </Tag>
      </template>
    </Column>
    <Column field="lowestPossibleScore" header="Lowest">
      <template #body="slotProps">
        <Tag severity="contrast" v-if="slotProps.data.lowestPossibleScore">
          {{ slotProps.data.lowestPossibleScore }}
        </Tag>
        <Tag severity="secondary" v-else>
          No
        </Tag>
      </template>
    </Column>
    <Column field="winCondition" header="Win">
      <template #body="slotProps">
        <Tag :severity="slotProps.data.winCondition === WinCondition.MostPoints ? 'contrast' : 'secondary'">
          {{ slotProps.data.winCondition }}
        </Tag>
      </template>
    </Column>
    <Column class="w-12 !text-end">
      <template #body="{ data }">
        <Button icon="pi pi-play" variant="text" severity="primary" @click="handleSelectGame(data)"></Button>
      </template>
    </Column>
  </DataTable>
</template>

<script lang="ts" setup>
import {type Game, WinCondition} from "~/types/global";

const roomStore = useRoomStore();
const router = useRouter();


const gameTypes = computed(() => {
  return roomStore.games.filter((game, index, self) =>
      index === self.findIndex((g) =>
          g.name === game.name &&
          g.startScore === game.startScore &&
          g.endingScore === game.endingScore &&
          g.lowestPossibleScore === game.lowestPossibleScore &&
          g.winCondition === game.winCondition
      )
  );
})

const handleSelectGame = (game: Game) => {
  console.log(game);
  roomStore.startGame(
    game.name,
    game.startScore,
    game.endingScore,
    game.winCondition,
    game.lowestPossibleScore
  );
  router.push('/games/current');
}
</script>

<style scoped>

</style>