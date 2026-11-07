import Graphic, { render } from "../graphic.js";
import PNGImage from "./image.js";

const rectangle = (x, y, w, h, color, image) => {
  for (let i = x; i < x + w; i++) {
    for (let j = y; j < y + h; j++) {
      image.buffer[image.index(i, j)] = color;
    }
  }
};

/** An identicon rendered as a palette PNG. */
export default class PNG extends Graphic {
  renderImage(hash, size, padding, background, foreground) {
    return render(
      hash,
      { size, padding, background, foreground },
      new PNGImage(size, size, 256),
      rectangle
    );
  }

  /**
   * @param {boolean} [preamble=true] prefix `data:image/png;base64,`
   * @returns {string} base64 PNG, as a data URI by default
   */
  toString(preamble = true) {
    return `${preamble ? "data:image/png;base64," : ""}${this.image.getBase64()}`;
  }
}
