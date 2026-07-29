import { Capacitor } from '@capacitor/core';

const MOBILE_UA_PATTERN = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

// iPadOS 13+ Safari reports a desktop Mac user agent, so multi-touch support
// on a "MacIntel" platform is the only remaining signal for real iPads.
const isIpad = () => navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

const isMobileOrTabletUserAgent = () => MOBILE_UA_PATTERN.test(navigator.userAgent) || isIpad();

export const useIsMobileDevice = () => {
  const isMobileDevice = ref(Capacitor.isNativePlatform());

  if (!Capacitor.isNativePlatform()) {
    onMounted(() => {
      isMobileDevice.value = isMobileOrTabletUserAgent();
    });
  }

  return isMobileDevice;
};
