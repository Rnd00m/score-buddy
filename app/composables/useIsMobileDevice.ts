import { Capacitor } from '@capacitor/core';

const MOBILE_UA_PATTERN = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

// iPadOS 13+ Safari reports a desktop Mac user agent, so multi-touch support
// on a "MacIntel" platform is the only remaining signal for real iPads.
const isIpad = () => navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

// Coarse pointer = touch-primary input, which is what actually distinguishes
// a phone/tablet from a desktop (including a desktop browser window resized
// narrow, which stays fine/mouse-driven). Kept as a fallback alongside the
// UA checks above since it also covers tablets whose UA/platform reporting
// changes between OS versions (e.g. iPadOS masking tweaks).
const hasCoarsePointer = () => window.matchMedia('(pointer: coarse)').matches;

const isMobileOrTabletUserAgent = () => MOBILE_UA_PATTERN.test(navigator.userAgent) || isIpad() || hasCoarsePointer();

export const useIsMobileDevice = () => {
  const isMobileDevice = ref(Capacitor.isNativePlatform());

  if (!Capacitor.isNativePlatform()) {
    onMounted(() => {
      isMobileDevice.value = isMobileOrTabletUserAgent();
    });
  }

  return isMobileDevice;
};
