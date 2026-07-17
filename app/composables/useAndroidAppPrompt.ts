import {Capacitor} from '@capacitor/core';

const PLAY_STORE_APP_URL = 'market://details?id=com.scorebuddy.app';
const STORAGE_KEY = 'androidAppPromptSeen';

export const useAndroidAppPrompt = () => {
  const isAndroidWebBrowser = (): boolean => {
    if (Capacitor.isNativePlatform()) return false;

    return /Android/i.test(navigator.userAgent);
  };

  const hasSeenPrompt = (): boolean => localStorage.getItem(STORAGE_KEY) === 'true';

  const markPromptAsSeen = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const shouldShowPrompt = (): boolean => isAndroidWebBrowser() && !hasSeenPrompt();

  const openPlayStore = () => {
    window.location.href = PLAY_STORE_APP_URL;
  };

  return {shouldShowPrompt, markPromptAsSeen, openPlayStore};
};