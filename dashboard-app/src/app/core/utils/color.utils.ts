export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

// https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color/3943023#3943023
// https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o

export function hexToRGB(hex: string): RGBColor {
  // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function luminance(color: RGBColor): number {
  const a = [color.r, color.g, color.b].map(function (v) {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow( (v + 0.055) / 1.055, 2.4 );
  });
  return (0.2126 * a[0]) + (0.7152 * a[1]) + (0.0722 * a[2]);
}

export function readableFontColor(hex: string): string {
  const color = hexToRGB(hex);
  const L = luminance(color);
  return (L > 0.179) ? '#000000' : '#ffffff';
}

