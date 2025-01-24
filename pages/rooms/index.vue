<template>
  <Toast position="top-center" class="max-w-[calc(100%-2rem)]"/>

  <h1 class="mb-6 flex justify-between items-center">
    <span class="text-3xl">Room</span>
    <NuxtLink to="/rooms/players/add">
      <Button severity="contrast" rounded icon="pi pi-user-plus" />
    </NuxtLink>
  </h1>

  <DataTable :value="roomStore.players" sortField="score" :sortOrder="-1" removableSort class="-mx-6">
    <template #empty> Currently no players. </template>
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
  </DataTable>
</template>

<script setup lang="ts">
const roomStore = useRoomStore();

const toast = useToast();
const handleRemovePlayer = (playerUuid: string) => {
  if (roomStore.currentGame !== null) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'You can\'t remove player while a game is in progress.', life: 4000 });
    return;
  }

  roomStore.removePlayer(playerUuid);
};
</script>

<style scoped>

</style>