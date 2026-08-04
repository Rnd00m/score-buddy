<template>
  <Toast position="bottom-center" class="max-w-[calc(100%-2rem)]"/>

  <div class="flex flex-col h-dvh">
    <div class="flex-1 min-h-0" :class="isTabRoute ? 'overflow-hidden' : 'main-content px-6 pb-6 pt-[calc(var(--native-inset-top,env(safe-area-inset-top))+var(--web-top-inset,0px)+0.5rem)] overflow-y-auto'">
      <BaseTabPager v-if="isTabRoute" :items="items"/>
      <div v-else class="lg:max-w-3xl mx-auto h-full">
        <NuxtPage/>
      </div>
    </div>
    <div class="sticky bottom-0 w-full">
      <BaseBottomNav :items="items" :floating="isMobileDevice"/>
    </div>
  </div>
  <VueQueryDevtools />

  <ConfirmDialog group="androidApp" class="max-w-96 w-[calc(100%-6rem)]" dismissableMask>
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
        <div class="rounded-full bg-primary text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20">
          <Android :size="48"/>
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
import { Play, History, Users, Clock, User, Android } from '@primeicons/vue';
import { Capacitor } from '@capacitor/core';

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
const router = useRouter();
// Nuxt's own useRoute() only updates via <NuxtPage>'s internal Suspense
// sync — since tab routes intentionally don't render <NuxtPage>, it would
// never advance past the last non-tab route. router.currentRoute (plain
// vue-router) always reflects the real current path, so use that here.
const currentPath = computed(() => router.currentRoute.value.path);

// the floating pill nav only makes sense on a real mobile/tablet device —
// on a desktop browser resized to a narrow width it stays a docked bar
const isMobileDevice = useIsMobileDevice();
watch(isMobileDevice, (floating) => {
  document.documentElement.classList.toggle('floating-nav', floating);
}, { immediate: true });

const items = computed(() => {
  return [
    { icon: Play, label: t('menu.play'), route: roomStore.currentGame !== null ? '/game' : '/games' },
    { icon: History, label: t('menu.history'), route: '/games/history' },
    { icon: Users, label: t('menu.rooms'), route: '/rooms' },
    { icon: Clock, label: t('menu.myHistory'), route: '/users/games/history' },
    { icon: User, label: t('menu.account'), route: '/account' },
  ];
});

// The 5 bottom-nav tab roots render through BaseTabPager (live swipeable),
// every other route (sub-pages like /account/login, /games/new, ...) keeps
// using <NuxtPage/> with the default CSS page transition.
const isTabRoute = computed(() => currentPath.value === '/games' || currentPath.value === '/game' || items.value.some(item => item.route === currentPath.value));

const { init: initColorScheme } = useColorScheme();
const { init: initWakeLock } = useScreenWakeLock();
const { init: initDuelMode } = useDuelMode();
const { init: initQuickScoreValues } = useQuickScoreValues();
const { shouldShowPrompt, markPromptAsSeen, openPlayStore } = useAndroidAppPrompt();
const confirm = useConfirm();

onMounted(() => {
  initColorScheme();
  initWakeLock();
  initDuelMode();
  initQuickScoreValues();

  // In a plain mobile browser tab there's no safe-area inset for the
  // address bar (unlike the native app's status bar), so the header ends
  // up flush against it — add breathing room there specifically.
  if (!Capacitor.isNativePlatform()) {
    document.documentElement.style.setProperty('--web-top-inset', '1rem');
  }

  if (shouldShowPrompt()) {
    confirm.require({
      group: 'androidApp',
      header: t('androidApp.title'),
      message: t('androidApp.message'),
      accept: () => {
        markPromptAsSeen();
        openPlayStore();
      },
      reject: () => {
        markPromptAsSeen();
      },
    });
  }
});
</script>
