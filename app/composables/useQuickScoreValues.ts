const STORAGE_KEY = 'quickScoreValues';

export const DEFAULT_QUICK_SCORE_VALUES = [5, 10, 20, 50, 100];

const values = ref<number[]>([...DEFAULT_QUICK_SCORE_VALUES]);

export const useQuickScoreValues = () => {
  const init = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length === DEFAULT_QUICK_SCORE_VALUES.length && parsed.every((value) => typeof value === 'number' && value > 0)) {
        values.value = parsed;
      }
    } catch {
      // ignore malformed storage, keep defaults
    }
  };

  const setValues = (newValues: number[]) => {
    values.value = newValues;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newValues));
  };

  return { values, init, setValues };
};