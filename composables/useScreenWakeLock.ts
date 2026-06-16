import { KeepAwake } from '@capacitor-community/keep-awake';

const STORAGE_KEY = 'keepScreenAwake';

const isSupported = ref(false);
const isEnabled = ref(false);

export const useScreenWakeLock = () => {
  const init = async () => {
    isSupported.value = (await KeepAwake.isSupported()).isSupported;
    isEnabled.value = isSupported.value && localStorage.getItem(STORAGE_KEY) === 'true';

    if (isEnabled.value) {
      await KeepAwake.keepAwake();
    }
  };

  const setEnabled = async (enabled: boolean) => {
    isEnabled.value = enabled;
    localStorage.setItem(STORAGE_KEY, String(enabled));

    if (enabled) {
      await KeepAwake.keepAwake();
    } else {
      await KeepAwake.allowSleep();
    }
  };

  return { isSupported, isEnabled, init, setEnabled };
};