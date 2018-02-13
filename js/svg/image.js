//     
import colorToArray from "../color-to-array.js";
export default class {
               
                     
                     
                         
  constructor(
    size        ,
    foreground                                 ,
    background                                 
  ) {
    this.size = size;
    this.foreground = this.color(foreground);
    this.background = this.color(background);
    this.rectangles = [];
  }
  color(input                                 ) {
    if (typeof input !== "object") {
      input = colorToArray(input);
    }
    const [r, g, b, a] = input;
    const values = [r, g, b].map(Math.round);
    values.push(a >= 0 && a <= 255 ? a / 255 : 1);
    return "rgba(" + values.join(",") + ")";
  }
  getDump()         {
    var i,
      xml,
      rect,
      fg = this.foreground,
      bg = this.background,
      stroke = this.size * 0.005;

    xml =
      "<svg xmlns='http://www.w3.org/2000/svg'" +
      " width='" +
      this.size +
      "' height='" +
      this.size +
      "'" +
      " style='background-color:" +
      bg +
      ";'>" +
      "<g style='fill:" +
      fg +
      "; stroke:" +
      fg +
      "; stroke-width:" +
      stroke +
      ";'>";

    for (i = 0; i < this.rectangles.length; i++) {
      rect = this.rectangles[i];
      if (rect.color == bg) continue;
      xml +=
        "<rect " +
        " x='" +
        rect.x +
        "'" +
        " y='" +
        rect.y +
        "'" +
        " width='" +
        rect.w +
        "'" +
        " height='" +
        rect.h +
        "'" +
        "/>";
    }
    xml += "</g></svg>";

    return xml;
  }
  getBase64()         {
    return btoa(this.getDump());
  }
}

//# sourceMappingURL=image.js.map
