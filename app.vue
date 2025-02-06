<template>
  <div class="flex flex-col min-h-screen">
    <NuxtLayout>
      <div class="p-6 overflow-y-auto flex-1 h-full">
        <NuxtPage/>
      </div>
      <div class="sticky bottom-0 w-full h-[70px]">
        <Menubar :model="items" breakpoint="0" class="h-full flex justify-center rounded-none">
          <template #item="{ item, props }">
            <RouterLink v-slot="{ href, navigate }" :to="item.route" custom>
              <a
                  v-ripple
                  :href="href"
                  v-bind="props.action"
                  @click="navigate"
                  :class="{ 'text-primary': isActive(item.route) }"
              >
                <span :class="item.icon" class="text-xl"/>
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
    { icon: 'pi pi-play', route: roomStore.currentGame !== null ? '/games/current' : '/games' },
    { icon: 'pi pi-users', route: '/rooms' },
  ];
});

const route = useRoute();

const isActive = (routePath: string) => {
  const parent = route.path.split('/')[1];
  const targetRouteParent = routePath.split('/')[1];

  return parent === targetRouteParent;
}
</script>