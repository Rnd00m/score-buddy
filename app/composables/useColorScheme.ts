const STORAGE_KEY = 'colorScheme';
const DARK_CLASS = 'app-dark';

type ColorScheme = 'light' | 'dark';

const colorScheme = ref<ColorScheme>('light');

export const useColorScheme = () => {
  const applyColorScheme = (scheme: ColorScheme) => {
    document.documentElement.classList.toggle(DARK_CLASS, scheme === 'dark');
  };

  const init = () => {
    const stored = localStorage.getItem(STORAGE_KEY) as ColorScheme | null;
    colorScheme.value = stored ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    applyColorScheme(colorScheme.value);
  };

  const setColorScheme = (scheme: ColorScheme) => {
    colorScheme.value = scheme;
    localStorage.setItem(STORAGE_KEY, scheme);

    applyColorScheme(scheme);
  };

  return { colorScheme, init, setColorScheme };
};