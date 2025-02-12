<template>
  <div class="flex flex-col min-h-screen">
    <div class="p-6 overflow-y-auto flex-1 h-full">
      <NuxtPage/>
    </div>
    <div class="sticky bottom-0 w-full h-[70px]">
      <Menubar :model="items" breakpoint="0" class="h-full flex justify-center rounded-none border-0">
        <template #item="{ item, props }">
          <RouterLink v-slot="{ href, navigate, isActive }" :to="item.route" custom>
            <a
              v-ripple
              :href="href"
              v-bind="props.action"
              @click="navigate"
              :class="{ 'route-active': isActive }"
            >
              <span :class="item.icon" class="text-2xl"/>
            </a>
          </RouterLink>
        </template>
      </Menubar>
    </div>
  </div>
</template>

<script setup lang="ts">
const roomStore = useRoomStore();

const items = computed(() => {
  return [
    { icon: 'pi pi-play', route: roomStore.currentGame !== null ? '/game' : '/games' },
    { icon: 'pi pi-history', route: '/games/history' },
    { icon: 'pi pi-users', route: '/rooms' },
  ];
});
</script>
