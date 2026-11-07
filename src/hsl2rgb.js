/**
 * Hue/saturation/lightness (all 0-1) to `[red, green, blue]` (0-255, not
 * rounded). The compact conversion identicon.js uses.
 *
 * @param {number} h
 * @param {number} s
 * @param {number} b
 * @returns {[number, number, number]}
 */
export default function hsl2rgb(h, s, b) {
  h *= 6;
  const S = [
    (b += s *= b < 0.5 ? b : 1 - b),
    b - (h % 1) * s * 2,
    (b -= s *= 2),
    b,
    b + (h % 1) * s,
    b + s,
  ];

  return [
    S[~~h % 6] * 255, // red
    S[(h | 16) % 6] * 255, // green
    S[(h | 8) % 6] * 255, // blue
  ];
}
