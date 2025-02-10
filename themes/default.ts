import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "#ecfdf5",
      100: "#d1fae5",
      200: "#a7f3d0",
      300: "#6ee7b7",
      400: "#34d399",
      500: "#10b981",
      600: "#059669",
      700: "#047857",
      800: "#065f46",
      900: "#064e3b",
      950: "#022c22"
    },
  }
});

export default {
  preset: MyPreset,
  options: {
    cssLayer: {
      name: 'primevue',
      order: 'tailwind-base, primevue, tailwind-utilities'
    }
  }
};
