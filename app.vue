<template>
  <div class="flex flex-col min-h-screen">
    <NuxtLayout>
      <div class="p-6 overflow-y-auto flex-1 h-full">
        <NuxtPage/>
      </div>
      <div class="sticky bottom-0 w-full h-[70px]">
        <Menubar :model="items" breakpoint="0" class="h-full flex justify-center rounded-none border-t-2 border-l-0 border-r-0 border-b-0">
          <template #item="{ item, props }">
            <RouterLink v-slot="{ href, navigate }" :to="item.route" custom>
              <a
                v-ripple
                :href="href"
                v-bind="props.action"
                @click="navigate"
                :class="{ 'text-primary': isActive(item.route) }"
              >
                <span :class="item.icon" class="text-2xl"/>
              </a>
            </RouterLink>
          </template>
        </Menubar>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
const roomStore = useRoomStore();

const items = computed(() => {
  return [
    { icon: 'pi pi-play', route: roomStore.currentGame !== null ? '/game' : '/games' },
    { icon: 'pi pi-history', route: '/games/history' },
    { icon: 'pi pi-users', route: '/rooms' },
  ];
});

const route = useRoute();

const isActive = (routePath: string) => route.path === routePath;
</script>