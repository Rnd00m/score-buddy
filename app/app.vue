<template>
  <div class="flex flex-col h-dvh">
    <div ref="mainContent" class="p-6 overflow-y-auto flex-1 min-h-0">
      <div class="max-w-3xl mx-auto h-full">
        <NuxtPage/>
      </div>
    </div>
    <div class="sticky bottom-0 w-full">
      <BaseBottomNav :items="items"/>
    </div>
  </div>
  <VueQueryDevtools />
</template>

<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'

const { t } = useI18n();
const roomStore = useRoomStore();
const user = useSupabaseUser();
const route = useRoute();
const router = useRouter();

const items = computed(() => {
  return [
    { icon: 'pi pi-play', label: t('menu.play'), route: roomStore.currentGame !== null ? '/game' : '/games' },
    { icon: 'pi pi-history', label: t('menu.history'), route: '/games/history' },
    { icon: 'pi pi-users', label: t('menu.rooms'), route: '/rooms' },
    { icon: 'pi pi-clock', label: t('menu.myHistory'), route: '/users/games/history' },
    { icon: 'pi pi-user', label: t('menu.account'), route: '/account' },
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
