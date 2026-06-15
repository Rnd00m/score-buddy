<template>
  <div class="flex flex-col h-dvh">
    <div ref="mainContent" class="p-6 overflow-y-auto flex-1 min-h-0">
      <NuxtPage/>
    </div>
    <div class="sticky bottom-0 w-full">
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
  <VueQueryDevtools />
</template>

<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'

const roomStore = useRoomStore();
const user = useSupabaseUser();
const route = useRoute();
const router = useRouter();

const items = computed(() => {
  return [
    { icon: 'pi pi-play', route: roomStore.currentGame !== null ? '/game' : '/games' },
    { icon: 'pi pi-history', route: '/games/history' },
    { icon: 'pi pi-users', route: '/rooms' },
    { icon: 'pi pi-user', route: '/account' },
  ];
});

const { init: initColorScheme } = useColorScheme();
const { init: initWakeLock } = useScreenWakeLock();
const { init: initDuelMode } = useDuelMode();

onMounted(() => {
  initColorScheme();
  initWakeLock();
  initDuelMode();
});

router.beforeEach((to, from) => {
  const routes = items.value.map(item => item.route);
  const fromIndex = routes.indexOf(from.path);
  const toIndex = routes.indexOf(to.path);

  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

  const pageTransition = {
    name: toIndex > fromIndex ? 'slide-left' : 'slide-right',
    mode: 'out-in' as const,
  };

  to.meta.pageTransition = pageTransition;
  from.meta.pageTransition = pageTransition;
});

const mainContent = ref<HTMLElement | null>(null);

useSwipe(mainContent, {
  onSwipeLeft: () => {
    const routes = items.value.map(item => item.route);
    const index = routes.indexOf(route.path);

    if (index === -1 || index === routes.length - 1) return;

    router.push(routes[index + 1]);
  },
  onSwipeRight: () => {
    const routes = items.value.map(item => item.route);
    const index = routes.indexOf(route.path);

    if (index <= 0) return;

    router.push(routes[index - 1]);
  },
});
</script>
