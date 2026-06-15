const STORAGE_KEY = 'duelMode';

const isEnabled = ref(false);

export const useDuelMode = () => {
  const init = () => {
    isEnabled.value = localStorage.getItem(STORAGE_KEY) === 'true';
  };

  const setEnabled = (enabled: boolean) => {
    isEnabled.value = enabled;
    localStorage.setItem(STORAGE_KEY, String(enabled));
  };

  return { isEnabled, init, setEnabled };
};