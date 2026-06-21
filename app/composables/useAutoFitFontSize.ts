const MIN_FONT_SIZE_PX = 14;

type ElementWithObserver = HTMLElement & { __autoFitObserver?: ResizeObserver };

const fit = (el: HTMLElement) => {
  const container = el.parentElement;
  if (!container) return;

  el.style.fontSize = '';
  const naturalFontSizePx = parseFloat(getComputedStyle(el).fontSize);
  const containerWidth = container.clientWidth;
  const textWidth = el.scrollWidth;

  if (containerWidth > 0 && textWidth > containerWidth) {
    el.style.fontSize = `${Math.max(MIN_FONT_SIZE_PX, naturalFontSizePx * (containerWidth / textWidth))}px`;
  }
};

export const useAutoFitFontSize = () => {
  const vAutoFitFontSize = {
    mounted(el: ElementWithObserver) {
      fit(el);

      const resizeObserver = new ResizeObserver(() => fit(el));
      if (el.parentElement) resizeObserver.observe(el.parentElement);
      el.__autoFitObserver = resizeObserver;
    },
    updated(el: HTMLElement) {
      nextTick(() => fit(el));
    },
    beforeUnmount(el: ElementWithObserver) {
      el.__autoFitObserver?.disconnect();
    },
  };

  return { vAutoFitFontSize };
};