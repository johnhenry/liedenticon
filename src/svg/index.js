import Graphic, { render } from "../graphic.js";
import SVGImage from "./image.js";

const rectangle = (x, y, w, h, color, image) => {
  image.rectangles.push({ x, y, w, h, color });
};

/** An identicon rendered as SVG markup. */
export default class SVG extends Graphic {
  renderImage(hash, size, padding, background, foreground) {
    return render(
      hash,
      { size, padding, background, foreground },
      new SVGImage(size, foreground, background),
      rectangle
    );
  }

  /**
   * @param {boolean} [preamble=false] return a `data:` URI instead of markup
   * @param {boolean} [base64=false] with `preamble`, base64-encode instead of
   *   percent-encoding
   * @returns {string}
   */
  toString(preamble = false, base64 = false) {
    if (base64) {
      return `${preamble ? "data:image/svg+xml;base64," : ""}${this.image.getBase64()}`;
    }
    const markup = this.image.getDump();
    return preamble
      ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`
      : markup;
  }
}
