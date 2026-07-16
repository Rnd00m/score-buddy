<template>
  <div class="flex flex-col h-dvh">
    <div ref="mainContent" class="px-6 pb-6 pt-[calc(env(safe-area-inset-top)+1.5rem)] overflow-y-auto flex-1 min-h-0">
      <div class="max-w-3xl mx-auto h-full">
        <NuxtPage/>
      </div>
    </div>
    <div class="sticky bottom-0 w-full">
      <BaseBottomNav :items="items"/>
    </div>
  </div>
  <VueQueryDevtools />

  <ConfirmDialog group="androidApp" class="max-w-96 w-[calc(100%-6rem)]" dismissableMask>
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
        <div class="rounded-full bg-primary text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20">
          <i class="pi pi-android text-5xl"></i>
        </div>
        <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
        <p class="mb-0 text-center">{{ message.message }}</p>
        <div class="flex items-center gap-2 mt-6">
          <Button severity="contrast" :label="t('androidApp.openButton')" @click="acceptCallback"></Button>
          <Button severity="secondary" :label="t('androidApp.continueButton')" outlined @click="rejectCallback"></Button>
        </div>
      </div>
    </template>
  </ConfirmDialog>
</template>

<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { Play, History, Users, Clock, User } from '@primeicons/vue';

const { t, locale } = useI18n();

useHead({
  htmlAttrs: {
    lang: locale,
  },
  meta: [
    {name: 'description', content: () => t('seo.description')},
    {property: 'og:description', content: () => t('seo.description')},
    {property: 'og:locale', content: () => locale.value === 'fr' ? 'fr_FR' : 'en_US'},
    {name: 'twitter:description', content: () => t('seo.description')},
  ],
});

const roomStore = useRoomStore();
const user = useSupabaseUser();
const route = useRoute();
const router = useRouter();

const items = computed(() => {
  return [
    { icon: Play, label: t('menu.play'), route: roomStore.currentGame !== null ? '/game' : '/games' },
    { icon: History, label: t('menu.history'), route: '/games/history' },
    { icon: Users, label: t('menu.rooms'), route: '/rooms' },
    { icon: Clock, label: t('menu.myHistory'), route: '/users/games/history' },
    { icon: User, label: t('menu.account'), route: '/account' },
  ];
});

const { init: initColorScheme } = useColorScheme();
const { init: initWakeLock } = useScreenWakeLock();
const { init: initDuelMode } = useDuelMode();
const { init: initQuickScoreValues } = useQuickScoreValues();
const { isAndroidWebBrowser, openPlayStore } = useAndroidAppPrompt();
const confirm = useConfirm();

onMounted(() => {
  initColorScheme();
  initWakeLock();
  initDuelMode();
  initQuickScoreValues();

  if (isAndroidWebBrowser()) {
    confirm.require({
      group: 'androidApp',
      header: t('androidApp.title'),
      message: t('androidApp.message'),
      accept: () => {
        openPlayStore();
      },
    });
  }
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
    const nextRoute = index !== -1 ? routes[index + 1] : undefined;

    if (!nextRoute) return;

    router.push(nextRoute);
  },
  onSwipeRight: () => {
    const routes = items.value.map(item => item.route);
    const index = routes.indexOf(route.path);
    const previousRoute = index > 0 ? routes[index - 1] : undefined;

    if (!previousRoute) return;

    router.push(previousRoute);
  },
});
</script>
