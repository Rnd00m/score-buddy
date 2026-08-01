<template>
  <div
    v-if="dates.length > 1"
    class="date-scroll-index"
    :class="{ 'date-scroll-index-active': isActive }"
    :style="{ top: `calc(${headerHeight}px + 0.5rem)` }"
    :aria-label="t('gameHistoryTable.jumpToDate')"
    role="slider"
    :aria-valuetext="label"
    @pointerdown="onPointerDown"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <div ref="trackRef" class="date-scroll-index-track">
      <div ref="thumbRef" class="date-scroll-index-thumb" :style="{ top: `${thumbOffset}px` }">
        <span class="date-scroll-index-label">{{ label }}</span>
        <span class="date-scroll-index-dot"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon';

const props = defineProps<{
  dates: Date[];
  container: HTMLElement | null;
}>();

const { t, locale } = useI18n();

const trackRef = ref<HTMLElement | null>(null);
const thumbRef = ref<HTMLElement | null>(null);
const scrollTop = ref(0);
const scrollHeight = ref(0);
const clientHeight = ref(0);
const thumbHeight = ref(32);
// So the track starts right below the table's own (sticky) header instead of
// overlapping it — measured rather than hardcoded since the header's height
// isn't fixed across locales/font sizes.
const headerHeight = ref(0);
const isDragging = ref(false);
const isHovering = ref(false);
const isScrolling = ref(false);
let hideTimeout: ReturnType<typeof setTimeout> | null = null;
let resizeObserver: ResizeObserver | null = null;
let mutationObserver: MutationObserver | null = null;
let thumbResizeObserver: ResizeObserver | null = null;
let headerResizeObserver: ResizeObserver | null = null;

const isActive = computed(() => isDragging.value || isHovering.value || isScrolling.value);

const measure = () => {
  const el = props.container;
  if (!el) return;

  scrollTop.value = el.scrollTop;
  scrollHeight.value = el.scrollHeight;
  clientHeight.value = el.clientHeight;
};

const fraction = computed(() => {
  const range = scrollHeight.value - clientHeight.value;
  if (range <= 0) return 0;

  return Math.min(Math.max(scrollTop.value / range, 0), 1);
});

const activeIndex = computed(() => {
  if (props.dates.length === 0) return 0;

  return Math.round(fraction.value * (props.dates.length - 1));
});

const label = computed(() => {
  const date = props.dates[activeIndex.value];
  if (!date) return '';

  return DateTime.fromJSDate(new Date(date)).setLocale(locale.value).toFormat('LLL yyyy');
});

const thumbOffset = computed(() => {
  const trackHeight = trackRef.value?.clientHeight ?? 0;
  const half = thumbHeight.value / 2;

  return Math.min(Math.max(fraction.value * trackHeight, half), Math.max(trackHeight - half, half));
});

const scheduleHide = () => {
  if (hideTimeout) clearTimeout(hideTimeout);
  hideTimeout = setTimeout(() => {
    isScrolling.value = false;
  }, 1000);
};

const onScroll = () => {
  measure();
  isScrolling.value = true;
  scheduleHide();
};

const onPointerEnter = () => {
  isHovering.value = true;
};

const onPointerLeave = () => {
  if (!isDragging.value) isHovering.value = false;
};

const seekToClientY = (clientY: number) => {
  const track = trackRef.value;
  const el = props.container;
  if (!track || !el) return;

  const rect = track.getBoundingClientRect();
  const ratio = rect.height > 0 ? Math.min(Math.max((clientY - rect.top) / rect.height, 0), 1) : 0;

  el.scrollTop = ratio * (el.scrollHeight - el.clientHeight);
  measure();
};

const onPointerMove = (event: PointerEvent) => {
  if (!isDragging.value) return;

  seekToClientY(event.clientY);
};

const stopDragging = () => {
  isDragging.value = false;
  isHovering.value = false;
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', stopDragging);
};

const onPointerDown = (event: PointerEvent) => {
  isDragging.value = true;
  seekToClientY(event.clientY);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', stopDragging);
};

watch(thumbRef, (el, oldEl) => {
  if (oldEl === el) return;

  thumbResizeObserver?.disconnect();
  thumbResizeObserver = null;
  if (!el) return;

  thumbHeight.value = el.offsetHeight;
  thumbResizeObserver = new ResizeObserver(() => {
    thumbHeight.value = el.offsetHeight;
  });
  thumbResizeObserver.observe(el);
}, { immediate: true });

watch(() => props.container, (el, oldEl) => {
  oldEl?.removeEventListener('scroll', onScroll);
  resizeObserver?.disconnect();
  mutationObserver?.disconnect();
  headerResizeObserver?.disconnect();
  resizeObserver = null;
  mutationObserver = null;
  headerResizeObserver = null;

  if (!el) return;

  el.addEventListener('scroll', onScroll, { passive: true });
  measure();

  resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(el);

  mutationObserver = new MutationObserver(measure);
  mutationObserver.observe(el, { childList: true, subtree: true });

  const header = el.querySelector('.p-datatable-thead');
  if (header) {
    headerHeight.value = header.clientHeight;
    headerResizeObserver = new ResizeObserver(() => {
      headerHeight.value = header.clientHeight;
    });
    headerResizeObserver.observe(header);
  }
}, { immediate: true });

onBeforeUnmount(() => {
  props.container?.removeEventListener('scroll', onScroll);
  resizeObserver?.disconnect();
  mutationObserver?.disconnect();
  thumbResizeObserver?.disconnect();
  headerResizeObserver?.disconnect();
  stopDragging();
  if (hideTimeout) clearTimeout(hideTimeout);
});
</script>

<style scoped>
.date-scroll-index {
  position: absolute;
  /* top comes from the headerHeight-driven inline style above (+0.5rem so it
     doesn't sit glued right against the header) so the track starts below
     the table's sticky header instead of overlapping it. bottom matches the
     same reserved clearance used for the table's own scroll (main.scss's
     .page-scroll rule), plus another 0.5rem so it doesn't sit glued right
     against the nav either, so the track stops above the floating nav
     instead of running behind it. */
  bottom: calc(var(--bottom-nav-height) + var(--bottom-nav-floating-offset) + 1rem + 0.5rem);
  right: -1.5rem;
  width: 2rem;
  display: flex;
  justify-content: flex-end;
  touch-action: none;
  cursor: pointer;
  z-index: 20;
}

.date-scroll-index-track {
  position: relative;
  width: 0.25rem;
  height: 100%;
}

.date-scroll-index-thumb {
  position: absolute;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.date-scroll-index-label {
  opacity: 0;
  transform: translateX(0.5rem);
  transition: opacity 0.2s ease, transform 0.2s ease;
  background: var(--p-primary-500);
  color: var(--p-surface-900);
  font-weight: 700;
  font-size: 1rem;
  white-space: nowrap;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  pointer-events: none;
}

.date-scroll-index-active .date-scroll-index-label {
  opacity: 1;
  transform: translateX(0);
}

.date-scroll-index-dot {
  width: 0.4375rem;
  height: 2rem;
  border-radius: 999px 0 0 999px;
  background: var(--p-primary-500);
  box-shadow: -1px 1px 4px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.date-scroll-index-active .date-scroll-index-dot {
  opacity: 1;
}
</style>
