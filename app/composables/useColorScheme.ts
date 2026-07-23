import { Capacitor, SystemBars, SystemBarsStyle } from '@capacitor/core';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';

const STORAGE_KEY = 'colorScheme';
const DARK_CLASS = 'app-dark';

type ColorScheme = 'light' | 'dark';
export type ColorSchemePreference = 'system' | ColorScheme;

const preference = ref<ColorSchemePreference>('system');
const colorScheme = ref<ColorScheme>('light');

let media: MediaQueryList | null = null;

const rgbToHex = (rgb: string) => {
  const match = rgb.match(/\d+/g);
  if (!match) return '#000000';

  const [r, g, b] = match.map(Number);
  return `#${[r, g, b].map(v => (v ?? 0).toString(16).padStart(2, '0')).join('')}`;
};

// the status bar must match the app's actual background, which is themed via CSS vars
const getStatusBarColor = () => rgbToHex(getComputedStyle(document.body).backgroundColor);

// the navigation bar must match the bottom nav's actual background, which is themed via CSS vars
const getNavigationBarColor = () => {
  const navigationBarElement = document.querySelector('.bottom-nav');
  if (!navigationBarElement) return '#000000';

  return rgbToHex(getComputedStyle(navigationBarElement).backgroundColor);
};

const getSystemColorScheme = (): ColorScheme => (
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
);

const isColorSchemePreference = (value: string | null): value is ColorSchemePreference =>
  value === 'system' || value === 'light' || value === 'dark';

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
    colorScheme.value = scheme;
    document.documentElement.classList.toggle(DARK_CLASS, scheme === 'dark');
    applySystemBars(scheme);
  };

  // Re-resolves the effective light/dark scheme from the current preference —
  // called both on init/preference change and whenever the OS scheme changes
  // while "system" is selected, so switching it live is reflected immediately.
  const resolve = () => {
    applyColorScheme(preference.value === 'system' ? getSystemColorScheme() : preference.value);
  };

  const init = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    preference.value = isColorSchemePreference(stored) ? stored : 'system';

    resolve();

    if (!media) {
      media = window.matchMedia('(prefers-color-scheme: dark)');
      media.addEventListener('change', () => {
        if (preference.value === 'system') resolve();
      });
    }
  };

  const setColorSchemePreference = (value: ColorSchemePreference) => {
    preference.value = value;
    localStorage.setItem(STORAGE_KEY, value);

    resolve();
  };

  return { colorScheme, preference, init, setColorSchemePreference };
};
