import {Capacitor} from '@capacitor/core';

const PLAY_STORE_APP_URL = 'market://details?id=com.scorebuddy.app';

export const useAndroidAppPrompt = () => {
  const isAndroidWebBrowser = (): boolean => {
    if (Capacitor.isNativePlatform()) return false;

    return /Android/i.test(navigator.userAgent);
  };

  const openPlayStore = () => {
    window.location.href = PLAY_STORE_APP_URL;
  };

  return {isAndroidWebBrowser, openPlayStore};
};