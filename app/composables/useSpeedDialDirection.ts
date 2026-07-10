type BaseDirection = 'down';
type FlippedDirection = 'up';

const FLIP_MAP: Record<BaseDirection, FlippedDirection> = {
  down: 'up',
};

// Matches the rendered .quick-score-action size and .p-speeddial-list gap.
const ITEM_SIZE = 40;
const ITEM_GAP = 8;
const SAFETY_BUFFER = 24;

/**
 * Speed dials default to opening downward, but near the bottom of the
 * scrollable area — which sits above the app's sticky bottom nav — that
 * pushes items off-screen/behind the nav and forces a scroll. This flips
 * the direction upward when there isn't enough room below the trigger to
 * fit the full linear item stack.
 */
export const useSpeedDialDirection = () => {
  const directions = reactive<Record<string, BaseDirection | FlippedDirection>>({});

  const getVisibleBottom = (trigger: HTMLElement) => {
    const scrollContainer = trigger.closest('.overflow-y-auto') as HTMLElement | null;

    return scrollContainer ? scrollContainer.getBoundingClientRect().bottom : window.innerHeight;
  };

  const updateDirection = (event: Event, key: string, base: BaseDirection, itemCount: number) => {
    const trigger = event.currentTarget as HTMLElement | null;
    if (!trigger) {
      directions[key] = base;
      return;
    }

    const requiredSpace = itemCount * ITEM_SIZE + (itemCount - 1) * ITEM_GAP + SAFETY_BUFFER;
    const spaceBelow = getVisibleBottom(trigger) - trigger.getBoundingClientRect().bottom;

    directions[key] = spaceBelow < requiredSpace ? FLIP_MAP[base] : base;
  };

  const getDirection = (key: string, base: BaseDirection) => directions[key] ?? base;

  return {updateDirection, getDirection};
};