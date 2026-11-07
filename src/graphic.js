import * as defaults from "./defaults.js";
import digest from "./digest.js";
import hsl2rgb from "./hsl2rgb.js";

// 15 digits drive the pixels; the last 7 drive the hue.
const HEX_HASH = /^[0-9a-f]{15,}$/i;

/**
 * Hex strings of 15 or more digits (an MD5 or SHA digest) are used as they
 * are, so they render exactly as they did in liedenticon 1.x. Anything else
 * (a username, an email, a short id) is run through `digest` first: reading
 * those as hex used to give every one of them the same broken color.
 *
 * @param {string} hash
 * @returns {string}
 */
export const normalizeHash = (hash) => {
  if (typeof hash !== "string") {
    throw new TypeError("hash must be a string");
  }
  return HEX_HASH.test(hash) ? hash : digest(hash);
};

const parsePadding = (padding) => {
  if (typeof padding !== "string") return padding;
  const index = padding.indexOf("%");
  return index > 0 ? Number(padding.slice(0, index)) / 100 : Number(padding);
};

/**
 * Draw the 5x5, horizontally mirrored grid onto `image` with `rectangle`.
 */
export const render = (hash, { size, padding, background, foreground }, image, rectangle) => {
  const baseMargin = Math.floor(size * padding);
  const cell = Math.floor((size - baseMargin * 2) / 5);
  const offset = Math.floor((size - cell * 5) / 2);
  const bg = image.color(background);
  const fg = image.color(foreground);

  // The first 15 digits control the pixels (odd = background). They fill the
  // middle column first, then each pair of columns mirrored outwards.
  for (let i = 0; i < 15; i++) {
    const color = parseInt(hash.charAt(i), 16) % 2 ? bg : fg;
    const row = (i % 5) * cell + offset;
    if (i < 5) {
      rectangle(2 * cell + offset, row, cell, cell, color, image);
    } else if (i < 10) {
      rectangle(1 * cell + offset, row, cell, cell, color, image);
      rectangle(3 * cell + offset, row, cell, cell, color, image);
    } else {
      rectangle(0 * cell + offset, row, cell, cell, color, image);
      rectangle(4 * cell + offset, row, cell, cell, color, image);
    }
  }
  return image;
};

/**
 * Base class for an identicon format. Subclasses implement `renderImage`
 * (return the drawn image) and `toString`.
 */
export default class Graphic {
  constructor(hash, options = {}) {
    const {
      size = defaults.size,
      saturation = defaults.saturation,
      brightness = defaults.brightness,
    } = options;
    // `??` rather than destructuring defaults: null means "use the default",
    // and 0 (black) is a real color.
    const padding = parsePadding(options.padding ?? defaults.padding);
    const background = options.background ?? defaults.background;
    hash = normalizeHash(hash);
    const foreground =
      options.foreground ??
      hsl2rgb(parseInt(hash.slice(-7), 16) / 0xfffffff, saturation, brightness);
    this.image = this.renderImage(hash, size, padding, background, foreground);
  }

  // eslint-disable-next-line no-unused-vars
  renderImage(hash, size, padding, background, foreground) {
    return null;
  }
}
