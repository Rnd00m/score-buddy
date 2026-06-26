import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.scorebuddy.app',
  appName: 'Score Buddy',
  webDir: '.output/public',
  android: {
    adjustMarginsForEdgeToEdge: 'disable',
    buildOptions: {
      releaseType: 'AAB',
    },
  },
  plugins: {
    SystemBars: {
      insetsHandling: 'disable',
    },
  },
};

export default config;