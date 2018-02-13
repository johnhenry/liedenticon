//@flow
import Graphic, { render } from "../graphic.js";
import Image from "./image.js";
const rectangle = (x, y, w, h, color, image) => {
  image.rectangles.push({ x: x, y: y, w: w, h: h, color: color });
};
type GraphicProps = {
  size: number,
  padding: number,
  background: number | string | Array<number>,
  saturation: number,
  brightness: number,
  foreground: number | string | Array<number>
};

export default class extends Graphic {
  renderImage(
    hash: string,
    size: number,
    padding: number,
    background: number | string | Array<number>,
    foreground: number | string | Array<number>
  ) {
    return render(
      hash,
      {
        size,
        padding,
        background,
        foreground
      },
      new Image(size, foreground, background),
      rectangle
    );
  }
  toString(preamble: boolean = false, base64: boolean = false) {
    if (base64) {
      return `${
        preamble ? "data:image/svg+xml;base64," : ""
      }${this.image.getBase64()}`;
    } else {
      return `${
        preamble ? "data:image/svg+xml;utf8," : ""
      }${this.image.getDump()}`;
    }
  }
}
