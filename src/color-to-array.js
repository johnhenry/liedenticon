const HEX = /^[0-9a-f]*$/i;

const expand = (digit) => parseInt(digit.repeat(2), 16);

/**
 * Normalize a color to `[red, green, blue, alpha]`, each 0-255.
 *
 * Accepts a hex string of 1, 2, 3, 4, 6 or 8 digits (with or without `#`),
 * a number (`0xRRGGBB`, or `0xRRGGBBAA` when it is larger than `0xffffff`),
 * or an `[r, g, b]` / `[r, g, b, a]` array.
 *
 * @param {string | number | number[]} input
 * @returns {[number, number, number, number]}
 */
export default function colorToArray(input) {
  if (Array.isArray(input)) {
    if (
      (input.length !== 3 && input.length !== 4) ||
      !input.every((n) => typeof n === "number" && Number.isFinite(n))
    ) {
      throw new TypeError(
        "a color array must hold 3 or 4 finite numbers: [r, g, b] or [r, g, b, a]"
      );
    }
    const [red, green, blue, alpha = 255] = input;
    return [red, green, blue, alpha];
  }

  let hex;
  if (typeof input === "number") {
    if (!Number.isInteger(input) || input < 0 || input > 0xffffffff) {
      throw new RangeError(
        `color ${input} is not an integer between 0 and 0xffffffff`
      );
    }
    // Pad so leading zero channels survive: 0x00ff00 is green, not "ff00".
    hex = input.toString(16).padStart(input > 0xffffff ? 8 : 6, "0");
  } else if (typeof input === "string") {
    hex = input.startsWith("#") ? input.slice(1) : input;
  } else {
    throw new TypeError(
      "a color must be a hex string, a number, or an [r, g, b, a] array"
    );
  }

  if (!HEX.test(hex)) {
    throw new Error(`color ${JSON.stringify(input)} is not a hex color`);
  }

  switch (hex.length) {
    case 0:
      return [0, 0, 0, 255];
    case 1:
    case 2: {
      const grey = expand(hex[0]);
      return [grey, grey, grey, hex.length > 1 ? expand(hex[1]) : 255];
    }
    case 3:
    case 4:
      return [
        expand(hex[0]),
        expand(hex[1]),
        expand(hex[2]),
        hex.length > 3 ? expand(hex[3]) : 255,
      ];
    case 6:
    case 8:
      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
        hex.length > 6 ? parseInt(hex.slice(6, 8), 16) : 255,
      ];
    default:
      throw new Error(`color of length ${hex.length} not supported`);
  }
}
