const STORAGE_KEY = 'keepScreenAwake';

const isEnabled = ref(false);
let sentinel: WakeLockSentinel | null = null;

export const useScreenWakeLock = () => {
  const isSupported = 'wakeLock' in navigator;

  const requestWakeLock = async () => {
    if (!isSupported) return;

    try {
      sentinel = await navigator.wakeLock.request('screen');
      sentinel.addEventListener('release', () => {
        sentinel = null;
      });
    } catch {
      isEnabled.value = false;
    }
  };

  const releaseWakeLock = async () => {
    await sentinel?.release();
    sentinel = null;
  };

  const init = () => {
    isEnabled.value = isSupported && localStorage.getItem(STORAGE_KEY) === 'true';

    if (isEnabled.value) {
      requestWakeLock();
    }

    document.addEventListener('visibilitychange', () => {
      if (isEnabled.value && document.visibilityState === 'visible') {
        requestWakeLock();
      }
    });
  };

  const setEnabled = async (enabled: boolean) => {
    isEnabled.value = enabled;
    localStorage.setItem(STORAGE_KEY, String(enabled));

    if (enabled) {
      await requestWakeLock();
    } else {
      await releaseWakeLock();
    }
  };

  return { isSupported, isEnabled, init, setEnabled };
};