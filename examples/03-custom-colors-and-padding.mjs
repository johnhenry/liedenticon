// Colors can be hex strings (1-8 digits), numbers or [r, g, b, a] arrays.
// Padding is a fraction of the size or a percentage string.
import assert from "node:assert/strict";
import { SVG, colorToArray } from "@johnhenry/sigil";

const svg = String(
  new SVG("ada@example.com", {
    size: 128,
    padding: "25%",
    foreground: 0x00aa55, // leading zero channels are kept
    background: "#000000ff",
  })
);
assert.match(svg, /fill:rgba\(0,170,85,1\)/);
assert.match(svg, /background-color:rgba\(0,0,0,1\)/);

assert.deepEqual(colorToArray("#f008"), [255, 0, 0, 136]);
assert.deepEqual(colorToArray([10, 20, 30]), [10, 20, 30, 255]);
console.log(svg.slice(0, 120) + "…");
