import { Capacitor, SystemBars, SystemBarsStyle } from '@capacitor/core';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';

const STORAGE_KEY = 'colorScheme';
const DARK_CLASS = 'app-dark';

type ColorScheme = 'light' | 'dark';

const BACKGROUND_COLOR: Record<ColorScheme, string> = {
  light: '#ffffff',
  dark: '#07203C',
};

const MENUBAR_COLOR: Record<ColorScheme, string> = {
  light: '#FFCE00',
  dark: '#243E57',
};

const colorScheme = ref<ColorScheme>('light');

export const useColorScheme = () => {
  const applySystemBars = (scheme: ColorScheme) => {
    if (!Capacitor.isNativePlatform()) return;

    EdgeToEdge.setStatusBarColor({ color: BACKGROUND_COLOR[scheme] });
    EdgeToEdge.setNavigationBarColor({ color: MENUBAR_COLOR[scheme] });
    SystemBars.setStyle({ style: scheme === 'dark' ? SystemBarsStyle.Dark : SystemBarsStyle.Light });
  };

  const applyColorScheme = (scheme: ColorScheme) => {
    document.documentElement.classList.toggle(DARK_CLASS, scheme === 'dark');
    applySystemBars(scheme);
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