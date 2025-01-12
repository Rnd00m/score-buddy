<template>
  <h1 class="mb-6 flex justify-between items-center">
    <span class="text-3xl">{{ roomStore.name }}</span>
    <NuxtLink to="/rooms/players/add">
      <Button icon="pi pi-user-plus" />
    </NuxtLink>
  </h1>

  <DataTable :value="roomStore.players" sortField="score" :sortOrder="-1" removableSort class="-mx-6">
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
  </DataTable>
</template>

<script setup lang="ts">
const roomStore = useRoomStore();
</script>

<style scoped>

</style>