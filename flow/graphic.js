//@flow
import * as defaults from "./defaults.js";
import hsl2rgb from "./hsl2rgb.js";
type renderProps = {
  size: number,
  padding: number,
  background: ?number | string | Array<number>,
  foreground: ?number | string | Array<number>
};

const render = (
  hash: string,
  { size, padding, background, foreground }: renderProps,
  image: any,
  rectangle: Function
) => {
  let baseMargin = Math.floor(size * padding);
  let cell = Math.floor((size - baseMargin * 2) / 5);
  padding = Math.floor((size - cell * 5) / 2);
  let bg = image.color(background);
  let fg = image.color(foreground);

  // the first 15 characters of the hash control the pixels (even/odd)
  // they are drawn down the middle first, then mirrored outwards
  let i, color;
  for (i = 0; i < 15; i++) {
    color = parseInt(hash.charAt(i), 16) % 2 ? bg : fg;
    if (i < 5) {
      rectangle(
        2 * cell + padding,
        i * cell + padding,
        cell,
        cell,
        color,
        image
      );
    } else if (i < 10) {
      rectangle(
        1 * cell + padding,
        (i - 5) * cell + padding,
        cell,
        cell,
        color,
        image
      );
      rectangle(
        3 * cell + padding,
        (i - 5) * cell + padding,
        cell,
        cell,
        color,
        image
      );
    } else if (i < 15) {
      rectangle(
        0 * cell + padding,
        (i - 10) * cell + padding,
        cell,
        cell,
        color,
        image
      );
      rectangle(
        4 * cell + padding,
        (i - 10) * cell + padding,
        cell,
        cell,
        color,
        image
      );
    }
  }
  return image;
};
export { render };

type GraphicProps = {
  size: number,
  padding: number,
  background: number | string | Array<number>,
  saturation: number,
  brightness: number,
  foreground: ?number | string | Array<number>
};
export default class {
  image: any;
  constructor(
    hash: string,
    {
      size,
      padding,
      background,
      saturation,
      brightness,
      foreground
    }: GraphicProps = defaults
  ) {
    if (typeof hash !== "string" || hash.length < 15) {
      throw "A hash of at least 15 characters is required.";
    }
    if (typeof padding === "string") {
      const index = padding.indexOf("%");
      if (index > 0) {
        padding = padding.substr(0, index);
        padding = Number(padding) / 100;
      } else {
        padding = Number(padding);
      }
    }
    // foreground defaults to last 7 chars as hue at 70% saturation, 50% brightness
    foreground =
      foreground ||
      hsl2rgb(
        parseInt(hash.substr(-7), 16) / 0xfffffff,
        saturation,
        brightness
      );
    this.image = this.renderImage(hash, size, padding, background, foreground);
  }
  renderImage(
    hash: string,
    size: number,
    padding: number,
    background: number | string | Array<number>,
    foreground: number | string | Array<number>
  ) {
    return null;
  }
}
