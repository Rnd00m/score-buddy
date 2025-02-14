import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

const MyPreset = definePreset(Aura, {
  primitive: {
    darkPrimary: {
      50:  "#E6F0FA",
      100: "#CCE2F5",
      200: "#99C4EB",
      300: "#66A6E0",
      400: "#3F8CD4",
      500: "#166FC8",
      600: "#125DA8",
      700: "#0E4B88",
      800: "#0A3768",
      900: "#07203C",
      950: "#041527"
    },
    darkSecondary: {
      50:  "#E8EFF6",
      100: "#D1DFED",
      200: "#A3BEDB",
      300: "#769DC9",
      400: "#4C7CB6",
      500: "#2E5F98",
      600: "#274F7E",
      700: "#1F4066",
      800: "#192F4D",
      900: "#243E57",
      950: "#162636"
    },
    green: {
      50:  "#F2F8E9",
      100: "#E3F1D1",
      200: "#C6E3A3",
      300: "#AAD675",
      400: "#92CA53",
      500: "#8CC63F",
      600: "#77A437",
      700: "#62832D",
      800: "#4C6223",
      900: "#36411A",
      950: "#232B0F"
    }
  },
  semantic: {
    primary: {
      50:  "#FFF8DC",
      100: "#FEF2B6",
      200: "#FEE98D",
      300: "#FEDF65",
      400: "#FFD53F",
      500: "#FFCE00",
      600: "#DAAD00",
      700: "#B68E00",
      800: "#936F00",
      900: "#795900",
      950: "#5A4200"
    },
    secondary: {
      50: "{green.50}",
      100: "{green.100}",
      200: "{green.200}",
      300: "{green.300}",
      400: "{green.400}",
      500: "{green.500}",
      600: "{green.600}",
      700: "{green.700}",
      800: "{green.800}",
      900: "{green.900}",
      950: "{green.950}"
    },
    navigation: {
      list: {
        padding: "0.5rem 0",
        gap: "0"
      },
      item: {
        padding: "1rem 1rem",
        borderRadius: "0",
        gap: "0"
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
          50:  "#E6F0FA",
          100: "#CCE2F5",
          200: "#99C4EB",
          300: "#66A6E0",
          400: "#3F8CD4",
          500: "#166FC8",
          600: "#125DA8",
          700: "#0E4B88",
          800: "#0A3768",
          900: "#07203C",
          950: "#041527"
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
