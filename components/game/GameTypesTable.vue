<template>
  <DataTable :value="gameTypes" removableSort scrollHeight="16rem">
    <Column field="name" header="Name" sortable></Column>
    <Column field="startScore" header="Start"></Column>
    <Column field="endingScore" header="Ending"></Column>
    <Column field="winCondition" header="Win">
      <template #body="slotProps">
        <Tag :severity="slotProps.data.winCondition === WinCondition.MostPoints ? 'primary' : 'secondary'">
          {{ slotProps.data.winCondition }}
        </Tag>
      </template>
    </Column>
    <Column class="w-24 !text-end">
      <template #body="{ data }">
        <Button icon="pi pi-chevron-right" severity="secondary" @click="handleSelectGame(data)"></Button>
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