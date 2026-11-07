// Graphic is the base class for every format. Subclass it to render the same
// mirrored 5x5 grid somewhere else: here, as text.
import assert from "node:assert/strict";
import Graphic, { render } from "@johnhenry/sigil/graphic";

class Text extends Graphic {
  renderImage(hash, size, padding, background, foreground) {
    const rows = Array.from({ length: 5 }, () => Array(5).fill(" "));
    const image = { color: (c) => (c === background ? "  " : "██") };
    render(hash, { size: 5, padding: 0, background, foreground }, image, (x, y, w, h, cell) => {
      rows[y][x] = cell;
    });
    return rows.map((row) => row.join("")).join("\n");
  }
  toString() {
    return this.image;
  }
}

const art = String(new Text("ada@example.com"));
for (const row of art.split("\n")) {
  assert.equal(row, [...row.match(/../g)].reverse().join(""), "mirrored");
}
console.log(art);
