//@flow
import Graphic, { render } from "../graphic.js";
import Image from "./image.js";
const rectangle = (x, y, w, h, color, image) => {
  for (let i = x; i < x + w; i++) {
    for (let j = y; j < y + h; j++) {
      image.buffer[image.index(i, j)] = color;
    }
  }
};
export default class extends Graphic {
  renderImage(
    hash: string,
    size: number,
    padding: number,
    background: ?number | string | Array<number>,
    foreground: ?number | string | Array<number>
  ) {
    return render(
      hash,
      {
        size,
        padding,
        background,
        foreground
      },
      new Image(size, size, 256),
      rectangle
    );
  }
  toString(preamble: boolean = true) {
    return `${
      preamble ? `data:image/png;base64,` : ""
    }${this.image.getBase64()}`;
  }
}
