<template>
  <h1 class="text-3xl mb-6">{{ roomStore.name }}</h1>

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

  <div class="flex justify-center flex-wrap mt-4">
    <NuxtLink to="/rooms/players/add">
      <Button  label="Add" icon="pi pi-plus" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const roomStore = useRoomStore();
</script>

<style scoped>

</style>