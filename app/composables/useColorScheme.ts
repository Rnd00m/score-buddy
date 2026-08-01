import { Capacitor, SystemBars, SystemBarsStyle } from '@capacitor/core';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';

const STORAGE_KEY = 'colorScheme';
const DARK_CLASS = 'app-dark';

type ColorScheme = 'light' | 'dark';
export type ColorSchemePreference = 'system' | ColorScheme;

const preference = ref<ColorSchemePreference>('system');
const colorScheme = ref<ColorScheme>('light');

let media: MediaQueryList | null = null;

const getSystemColorScheme = (): ColorScheme => (
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
);

const isColorSchemePreference = (value: string | null): value is ColorSchemePreference =>
  value === 'system' || value === 'light' || value === 'dark';

const applyNativeInsetVars = async () => {
  if (Capacitor.getPlatform() !== 'android') return;

  await EdgeToEdge.enable();
  const insets = await EdgeToEdge.getInsets();
  const dpr = window.devicePixelRatio || 1;

  document.documentElement.style.setProperty('--native-inset-top', `${insets.top / dpr}px`);
  document.documentElement.style.setProperty('--native-inset-bottom', `${insets.bottom / dpr}px`);
};

export const useColorScheme = () => {
  const applySystemBars = async (scheme: ColorScheme) => {
    if (!Capacitor.isNativePlatform()) return;

    const style = scheme === 'dark' ? SystemBarsStyle.Dark : SystemBarsStyle.Light;

    await applyNativeInsetVars();
    await EdgeToEdge.disable();
    await SystemBars.setStyle({ style });
  };

  const applyColorScheme = (scheme: ColorScheme) => {
    colorScheme.value = scheme;
    document.documentElement.classList.toggle(DARK_CLASS, scheme === 'dark');
    applySystemBars(scheme);
  };

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
