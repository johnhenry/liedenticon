//     
import Graphic, { render } from "../graphic.mjs";
import Image from "./image.mjs";
const rectangle = (x, y, w, h, color, image) => {
  for (let i = x; i < x + w; i++) {
    for (let j = y; j < y + h; j++) {
      image.buffer[image.index(i, j)] = color;
    }
  }
};
export default class extends Graphic {
  renderImage(
    hash        ,
    size        ,
    padding        ,
    background                                  ,
    foreground                                  
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
  toString(preamble          = true) {
    return `${
      preamble ? `data:image/png;base64,` : ""
    }${this.image.getBase64()}`;
  }
}

//# sourceMappingURL=index.js.map
