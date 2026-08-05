<template>
  <div ref="pagerRef" class="tab-pager" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd" @touchcancel="onTouchCancel">
    <div ref="trackRef" class="tab-pager-track">
      <div v-for="(item, index) in items" :key="item.route" class="tab-pager-panel">
        <div class="main-content px-6 pb-6 pt-[calc(var(--native-inset-top,env(safe-area-inset-top))+var(--web-top-inset,0px)+0.5rem)] overflow-y-auto h-full">
          <div class="lg:max-w-3xl mx-auto h-full">
            <template v-if="warmedIndices.has(index)">
              <template v-if="index === 0">
                <GamePage v-if="roomStore.currentGame"/>
                <GamesIndexPage v-else/>
              </template>
              <GamesHistoryPage v-else-if="index === 1"/>
              <RoomsIndexPage v-else-if="index === 2"/>
              <UsersGamesHistoryPage v-else-if="index === 3"/>
              <AccountIndexPage v-else-if="index === 4"/>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// These 5 pages are rendered directly (bypassing <NuxtPage>/<RouterView>) so
// all of them can stay mounted side by side for a live drag-following swipe.
// None of them read route params, so this is safe — but don't add
// onBeforeRouteLeave/onBeforeRouteUpdate to any of these pages, those guards
// only work when a page is rendered through an actual <RouterView>. Also,
// don't reach for useRoute() anywhere in this subtree: Nuxt only advances
// it via <NuxtPage>'s internal Suspense sync, which never runs for tab
// routes — use router.currentRoute (see currentPath below) instead.
import type {Component} from 'vue';
import GamesIndexPage from '~/pages/games/index.vue';
import GamePage from '~/pages/game.vue';
import GamesHistoryPage from '~/pages/games/history.vue';
import RoomsIndexPage from '~/pages/rooms/index.vue';
import UsersGamesHistoryPage from '~/pages/users/games/history.vue';
import AccountIndexPage from '~/pages/account/index.vue';

const props = defineProps<{
  items: { icon: Component; label: string; route: string }[];
}>();

const roomStore = useRoomStore();
const router = useRouter();
// Nuxt's own useRoute() only updates via <NuxtPage>'s internal Suspense
// sync — since tab routes bypass <NuxtPage> entirely, it never advances
// here. router.currentRoute (plain vue-router) always reflects the real
// current path regardless of what's mounted, so use that instead.
const currentPath = computed(() => router.currentRoute.value.path);

const pagerRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);

// The Play tab's route flips between /games and /game depending on
// roomStore.currentGame, so it needs matching against both regardless of
// which one is the "current" entry in props.items.
const resolveIndex = (path: string): number => {
  if (path === '/games' || path === '/game') return 0;

  return props.items.findIndex(item => item.route === path);
};

const activeIndex = ref(Math.max(resolveIndex(currentPath.value), 0));
const warmedIndices = ref(new Set<number>());

const warm = (index: number) => {
  for (const i of [index - 1, index, index + 1]) {
    if (i >= 0 && i < props.items.length) warmedIndices.value.add(i);
  }
};
warm(activeIndex.value);

const SETTLE_TRANSITION = 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)';

const applyTransform = (index: number, dragPx = 0, animated = false) => {
  const track = trackRef.value;
  if (!track) return;

  track.style.transition = animated ? SETTLE_TRANSITION : '';
  track.style.transform = `translateX(calc(-${index * 100}% + ${dragPx}px))`;
};

// Keeps the pager in sync with taps on BaseBottomNav and any programmatic
// router.push elsewhere in the app (e.g. GameTypesTable.vue, games/new.vue).
watch(currentPath, (path) => {
  if (isDragging) return;

  const index = resolveIndex(path);
  if (index === -1) return;

  activeIndex.value = index;
  warm(index);
  applyTransform(index, 0, true);
});

onMounted(() => {
  applyTransform(activeIndex.value);
});

const EXCLUDED_SELECTOR = '.player-score-card, .date-scroll-index, .game-actions, button, input, textarea, select, [contenteditable]';
const DIRECTION_LOCK_PX = 10;
const RUBBER_BAND_FACTOR = 0.35;

let startX = 0;
let startY = 0;
let isDragging = false;
let directionLocked = false;
let lastDx = 0;
let containerWidth = 0;
const velocitySamples: { t: number; x: number }[] = [];

const onTouchStart = (event: TouchEvent) => {
  const touch = event.touches[0];
  if (!touch) return;

  if ((event.target as HTMLElement | null)?.closest(EXCLUDED_SELECTOR)) return;

  startX = touch.clientX;
  startY = touch.clientY;
  isDragging = false;
  directionLocked = false;
  lastDx = 0;
  containerWidth = pagerRef.value?.clientWidth ?? 1;
  velocitySamples.length = 0;
  velocitySamples.push({t: performance.now(), x: touch.clientX});
};

const dampen = (dx: number) => {
  const atStart = activeIndex.value === 0 && dx > 0;
  const atEnd = activeIndex.value === props.items.length - 1 && dx < 0;

  return atStart || atEnd ? dx * RUBBER_BAND_FACTOR : dx;
};

const onTouchMove = (event: TouchEvent) => {
  const touch = event.touches[0];
  if (!touch) return;

  const dx = touch.clientX - startX;
  const dy = touch.clientY - startY;

  if (!directionLocked) {
    if (Math.abs(dx) < DIRECTION_LOCK_PX && Math.abs(dy) < DIRECTION_LOCK_PX) return;

    directionLocked = true;
    isDragging = Math.abs(dx) > Math.abs(dy);
    if (!isDragging) return;
  }

  if (!isDragging) return;

  event.preventDefault();

  lastDx = dampen(dx);
  velocitySamples.push({t: performance.now(), x: touch.clientX});
  while (velocitySamples.length > 1 && performance.now() - velocitySamples[0]!.t > 100) {
    velocitySamples.shift();
  }

  applyTransform(activeIndex.value, lastDx);
};

const getVelocity = (): number => {
  if (velocitySamples.length < 2) return 0;

  const first = velocitySamples[0]!;
  const last = velocitySamples[velocitySamples.length - 1]!;
  const dt = last.t - first.t;

  return dt > 0 ? (last.x - first.x) / dt : 0;
};

const settle = () => {
  if (!isDragging) return;

  const distance = Math.abs(lastDx);
  const velocity = getVelocity();
  const pastThreshold = distance > Math.min(containerWidth * 0.3, 120);
  const isFlick = distance >= 18 && Math.abs(velocity) >= 0.45;

  let targetIndex = activeIndex.value;
  if (pastThreshold || isFlick) {
    targetIndex = lastDx < 0
      ? Math.min(activeIndex.value + 1, props.items.length - 1)
      : Math.max(activeIndex.value - 1, 0);
  }

  isDragging = false;
  directionLocked = false;

  if (targetIndex !== activeIndex.value) {
    activeIndex.value = targetIndex;
    warm(targetIndex);
    applyTransform(targetIndex, 0, true);

    const targetRoute = targetIndex === 0
      ? (roomStore.currentGame !== null ? '/game' : '/games')
      : props.items[targetIndex]!.route;

    router.push(targetRoute);
  } else {
    applyTransform(activeIndex.value, 0, true);
  }
};

const onTouchEnd = () => settle();
const onTouchCancel = () => settle();
</script>

<style scoped>
.tab-pager {
  height: 100%;
  overflow-x: hidden;
  touch-action: pan-y;
}

.tab-pager-track {
  display: flex;
  height: 100%;
  will-change: transform;
}

.tab-pager-panel {
  flex: 0 0 100%;
  min-width: 0;
  height: 100%;
}
</style>
