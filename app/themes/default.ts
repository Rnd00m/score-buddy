import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

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
    // Bumped up from Aura's defaults (0.75rem/0.5rem, no explicit fontSize) so
    // form controls read at a comfortable size on phones — this cascades to
    // every input built on the shared form-field tokens (InputText, InputNumber,
    // Select, AutoComplete, Password, ...).
    formField: {
      fontSize: '1.0625rem',
      paddingX: '0.875rem',
      paddingY: '0.625rem',
    },
    list: {
      option: {
        padding: '0.75rem 0.875rem',
      },
    },
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
      item: {
        padding: "0.75rem",
      },
    },
    colorScheme: {
      light: {
        navigation: {
          item: {
            focusBackground: "{surface.100}",
            activeBackground: "{primary.500}",
            color: "{text.color}",
            focusColor: "{text.color}",
            activeColor: "{surface.900}",
            icon: {
              color: "{primary.500}",
              focusColor: "{primary.500}",
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
            focusBackground: "{surface.800}",
            activeBackground: "{primary.500}",
            color: "{text.color}",
            focusColor: "{text.color}",
            activeColor: "{surface.900}",
            icon: {
              color: "{primary.500}",
              focusColor: "{primary.500}",
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
  },
  components: {
    // Button's default paddingY/X are aliases of formField.padding, so bumping
    // formField above also grew regular buttons and made icon-only buttons
    // (header actions, etc.) taller than wide, since iconOnlyWidth is a fixed,
    // separate token. Un-alias the padding back to Aura's original size so
    // buttons stay compact, and keep iconOnlyWidth matching so they're square.
    button: {
      root: {
        paddingX: '0.75rem',
        paddingY: '0.5rem',
        iconOnlyWidth: '2.75rem',
      },
    },
    // Notifications felt cramped on phones at Aura's defaults; size them up
    // to match the bumped-up formField scale above.
    toast: {
      icon: {size: '1.375rem'},
      content: {padding: '1rem'},
      summary: {fontSize: '1.125rem'},
      detail: {fontSize: '1rem'},
      closeIcon: {size: '1.375rem'},
    },
    message: {
      icon: {size: '1.375rem'},
      content: {padding: '0.75rem 1rem'},
      text: {fontSize: '1.0625rem'},
    },
    // SelectButton renders its options as ToggleButtons, so this also grows
    // the win-condition selector on the new game screen.
    togglebutton: {
      content: {padding: '0.625rem 1rem'},
    },
    toggleswitch: {
      root: {width: '3rem', height: '1.75rem'},
      handle: {size: '1.25rem'},
    },
  },
});

export default {
  preset: MyPreset,
  options: {
    darkModeSelector: '.app-dark',
    cssLayer: {
      name: 'primevue',
      order: 'tailwind-base, primevue, tailwind-utilities'
    }
  }
};
