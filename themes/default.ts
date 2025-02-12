import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

const MyPreset = definePreset(Aura, {
  primitive: {
    deepBlue: {
      50: "#E8EFF6",
      100: "#D1DFED",
      200: "#A3BEDB",
      300: "#769DC9",
      400: "#4C7CB6",
      500: "#2E5F98",
      600: "#274F7E",
      700: "#1F4066",
      800: "#192F4D",
      900: "#243E59",
      950: "#16293D"
    },
  },
  semantic: {
    primary: {
      50: "#FFFCDF",
      100: "#FEF9CB",
      200: "#FEF198",
      300: "#FEE765",
      400: "#FEDE3F",
      500: "#FECE00",
      600: "#DAAC00",
      700: "#B68D00",
      800: "#936E00",
      900: "#795900",
      950: "#5F4700"
    },
    navigation: {
      list: {
        padding: "0.5rem 0",
        gap: "0"
      },
      item: {
        padding: "0.75rem 0.75rem",
        borderRadius: "0",
        gap: "0.5rem"
      },
      submenuLabel: {
        padding: "0.625rem 1rem",
        fontWeight: "600"
      },
      submenuIcon: {
        size: "0.875rem"
      }
    },
    colorScheme: {
      light: {
        navigation: {
          item: {
            focusBackground: "transparent",
            activeBackground: "{primary.500}",
            color: "{text.color}",
            focusColor: "{text.color}",
            activeColor: "{surface.900}",
            icon: {
              color: "{primary.500}",
              focusColor: "transparent",
              activeColor: "{surface.400}"
            }
          },
          submenuLabel: {
            background: "transparent",
            color: "{text.color}"
          },
          submenuIcon: {
            color: "{surface.500}",
            focusColor: "transparent",
            activeColor: "{surface.400}"
          }
        }
      },
      dark: {
        surface: {
          50: "#E6F0FA",
          100: "#CCE2F5",
          200: "#99C5EB",
          300: "#66A7E0",
          400: "#3F8CD4",
          500: "#166FC8",
          600: "#125DA8",
          700: "#0E4B88",
          800: "#0A3868",
          900: "#07213C",
          950: "#041427"
        },
        menubar: {
          background: 'red',
        },
        navigation: {
          item: {
            focusBackground: "transparent",
            activeBackground: "{primary.500}",
            color: "{text.color}",
            focusColor: "{text.color}",
            activeColor: "{surface.900}",
            icon: {
              color: "{primary.500}",
              focusColor: "transparent",
              activeColor: "{surface.400}"
            }
          },
          submenuLabel: {
            background: "transparent",
            color: "{text.color}"
          },
          submenuIcon: {
            color: "{surface.500}",
            focusColor: "transparent",
            activeColor: "{surface.400}"
          }
        }
      }
    }
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
