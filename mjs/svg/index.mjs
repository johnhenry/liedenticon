//     
import Graphic, { render } from "../graphic.mjs";
import Image from "./image.mjs";
const rectangle = (x, y, w, h, color, image) => {
  image.rectangles.push({ x: x, y: y, w: w, h: h, color: color });
};
                     
               
                  
                                              
                     
                     
                                             
  

export default class extends Graphic {
  renderImage(
    hash        ,
    size        ,
    padding        ,
    background                                 ,
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
      new Image(size, foreground, background),
      rectangle
    );
  }
  toString(preamble          = false, base64          = false) {
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

//# sourceMappingURL=index.js.map
