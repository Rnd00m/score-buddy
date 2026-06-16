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
};

export default config;