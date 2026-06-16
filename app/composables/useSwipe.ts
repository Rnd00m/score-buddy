import type { Ref } from 'vue';

interface UseSwipeOptions {
  threshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export const useSwipe = (target: Ref<HTMLElement | null>, options: UseSwipeOptions = {}) => {
  const threshold = options.threshold ?? 80;

  let startX = 0;
  let startY = 0;

  const onTouchStart = (event: TouchEvent) => {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
  };

  const onTouchEnd = (event: TouchEvent) => {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    if (Math.abs(deltaX) < threshold || Math.abs(deltaX) < Math.abs(deltaY)) return;

    if (deltaX < 0) {
      options.onSwipeLeft?.();
    } else {
      options.onSwipeRight?.();
    }
  };

  onMounted(() => {
    target.value?.addEventListener('touchstart', onTouchStart, { passive: true });
    target.value?.addEventListener('touchend', onTouchEnd, { passive: true });
  });

  onUnmounted(() => {
    target.value?.removeEventListener('touchstart', onTouchStart);
    target.value?.removeEventListener('touchend', onTouchEnd);
  });
};
