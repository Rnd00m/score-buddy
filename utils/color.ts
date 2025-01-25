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