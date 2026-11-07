import colorToArray from "../color-to-array.js";

const encodeBase64 = (text) =>
  typeof btoa === "function"
    ? btoa(text)
    : globalThis.Buffer.from(text, "latin1").toString("base64");

export default class SVGImage {
  constructor(size, foreground, background) {
    this.size = size;
    this.foreground = this.color(foreground);
    this.background = this.color(background);
    this.rectangles = [];
  }

  color(input) {
    const [r, g, b, a] = colorToArray(input);
    const values = [r, g, b].map(Math.round);
    values.push(a >= 0 && a <= 255 ? a / 255 : 1);
    return "rgba(" + values.join(",") + ")";
  }

  getDump() {
    const fg = this.foreground;
    const bg = this.background;
    const stroke = this.size * 0.005;

    let xml =
      "<svg xmlns='http://www.w3.org/2000/svg'" +
      " width='" + this.size + "' height='" + this.size + "'" +
      " style='background-color:" + bg + ";'>" +
      "<g style='fill:" + fg + "; stroke:" + fg + "; stroke-width:" + stroke + ";'>";

    for (const rect of this.rectangles) {
      if (rect.color == bg) continue;
      xml +=
        "<rect " +
        " x='" + rect.x + "'" +
        " y='" + rect.y + "'" +
        " width='" + rect.w + "'" +
        " height='" + rect.h + "'" +
        "/>";
    }
    xml += "</g></svg>";
    return xml;
  }

  getBase64() {
    return encodeBase64(this.getDump());
  }
}
