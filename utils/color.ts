import type {Color} from "~/types/global";

/**
 * Lighten or darken a color
 *
 * @param hexColor
 * @param type
 */
export const adjustColor = (hexColor: string, type: 'light' | 'dark'): string => {
  let color = hexColor.replace("#", "");
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);

  if (type === 'dark') {
    r = Math.max(r - 40, 0);
    g = Math.max(g - 40, 0);
    b = Math.max(b - 40, 0);
  } else {
    r = Math.min(r + 40, 255);
    g = Math.min(g + 40, 255);
    b = Math.min(b + 40, 255);
  }

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Get the contrast color for a given color
 *
 * @param hexColor
 */
export const getContrastYIQ = (hexColor: string): string => {
  const color = hexColor.replace("#", "");
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#FFFFFF';
};

export const getTextColorContrasted = (color: string): string => {
  return getContrastYIQ(color) || '#000000';
};

export const PLAYER_COLORS: Color[] = [
  { name: "Chestnut Brown", value: "#8B4513" },
  { name: "Alizarin", value: "#e74c3c" },
  { name: "Orange", value: "#f39c12" },
  { name: "Sunflower Yellow", value: "#FFD700" },
  { name: "Lime Green", value: "#32CD32" },
  { name: "Emerald Green", value: "#2E8B57" },
  { name: "Sky Blue", value: "#87CEEB" },
  { name: "Royal Blue", value: "#4169E1" },
  { name: "Navy Blue", value: "#000080" },
  { name: "Wisteria", value: "#8e44ad" },
  { name: "Hot Pink", value: "#FF69B4" },
  { name: "Rose Pink", value: "#FF1493" },
  { name: "Turquoise", value: "#40E0D0" },
  { name: "Teal", value: "#008080" },
  { name: "Silver", value: "#bdc3c7" },
  { name: "Jet Black", value: "#000000" },
];