/// <reference types="@capawesome/capacitor-android-edge-to-edge-support" />

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.scorebuddy.app',
  appName: 'Score Buddy',
  webDir: '.output/public',
  android: {
    buildOptions: {
      releaseType: 'APK',
    },
  },
  plugins: {
    SystemBars: {
      insetsHandling: 'disable',
    },
    EdgeToEdge: {
      statusBarColor: '#ffffff',
      navigationBarColor: '#FFCE00',
    },
  },
};

export default config;