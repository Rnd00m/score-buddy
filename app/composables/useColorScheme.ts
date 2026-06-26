import { Capacitor, SystemBars, SystemBarsStyle } from '@capacitor/core';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';

const STORAGE_KEY = 'colorScheme';
const DARK_CLASS = 'app-dark';

type ColorScheme = 'light' | 'dark';

const colorScheme = ref<ColorScheme>('light');

const rgbToHex = (rgb: string) => {
  const match = rgb.match(/\d+/g);
  if (!match) return '#000000';

  const [r, g, b] = match.map(Number);
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
};

// the status bar must match the app's actual background, which is themed via CSS vars
const getStatusBarColor = () => rgbToHex(getComputedStyle(document.body).backgroundColor);

// the navigation bar must match the bottom nav's actual background, which is themed via CSS vars
const getNavigationBarColor = () => {
  const navigationBarElement = document.querySelector('.bottom-nav');
  if (!navigationBarElement) return '#000000';

  return rgbToHex(getComputedStyle(navigationBarElement).backgroundColor);
};

export const useColorScheme = () => {
  const applySystemBars = async (scheme: ColorScheme) => {
    if (!Capacitor.isNativePlatform()) return;

    const style = scheme === 'dark' ? SystemBarsStyle.Dark : SystemBarsStyle.Light;

    await EdgeToEdge.enable();
    await EdgeToEdge.setStatusBarColor({ color: getStatusBarColor() });
    await EdgeToEdge.setNavigationBarColor({ color: getNavigationBarColor() });
    await SystemBars.setStyle({ style });
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