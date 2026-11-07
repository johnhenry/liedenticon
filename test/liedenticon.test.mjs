import { test, describe, mock } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { crc32, inflateSync } from "node:zlib";
import { SVG, PNG, Graphic, render, normalizeHash, colorToArray } from "../src/index.js";
import GraphicSubpath from "@johnhenry/liedenticon/graphic";
import digest from "../src/digest.js";
import hsl2rgb from "../src/hsl2rgb.js";

const HASH = "efb8c90a13f7a1fdc4910";
const sha256 = (s) => createHash("sha256").update(s).digest("hex");
const fill = (svg) => svg.match(/fill:(rgba\([^)]*\))/)[1];
const rects = (svg) => (svg.match(/<rect/g) || []).length;

// Parse a PNG: check the signature and every chunk CRC, return the chunks.
const parsePNG = (bytes) => {
  assert.deepEqual([...bytes.subarray(0, 8)], [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const chunks = {};
  let offset = 8;
  while (offset < bytes.length) {
    const length = bytes.readUInt32BE(offset);
    const type = bytes.subarray(offset + 4, offset + 8).toString("latin1");
    const data = bytes.subarray(offset + 8, offset + 8 + length);
    const crc = bytes.readUInt32BE(offset + 8 + length);
    assert.equal(crc32(bytes.subarray(offset + 4, offset + 8 + length)), crc, `${type} CRC`);
    chunks[type] = data;
    offset += 12 + length;
  }
  return chunks;
};

describe("compatibility with liedenticon 1.0.1", () => {
  const golden = JSON.parse(
    readFileSync(new URL("./fixtures/golden-1.0.1.json", import.meta.url), "utf8")
  );
  for (const c of golden.cases) {
    test(`${c.hash} with options #${c.opts} renders byte-identically`, () => {
      const opts = golden.opts[c.opts] ?? undefined;
      assert.equal(sha256(String(new SVG(c.hash, opts))), c.svg, "svg");
      assert.equal(sha256(new SVG(c.hash, opts).toString(true, true)), c.svgUri, "svg base64");
      assert.equal(sha256(String(new PNG(c.hash, opts))), c.png, "png");
    });
  }
});

describe("hashes", () => {
  test("hex strings of 15+ digits are used as they are", () => {
    assert.equal(normalizeHash(HASH), HASH);
    assert.equal(normalizeHash("ABCDEF0123456789"), "ABCDEF0123456789");
  });

  test("anything else is digested to 32 hex digits", () => {
    for (const input of ["", "a", "hello world", "john@example.com", "abc123", "😀"]) {
      assert.match(normalizeHash(input), /^[0-9a-f]{32}$/, JSON.stringify(input));
    }
  });

  test("digest output is pinned (it is part of the public contract)", () => {
    // Changing these changes every non-hex identicon: that is a breaking
    // release, not a refactor.
    assert.deepEqual(["", "a", "hello world", "john@example.com"].map(digest), [
      "4a216c31f7e857482762e10d9def1c80",
      "493cefa9f11f42170a0c9ac49b3b4bcd",
      "ffa25708c475079791f3987a191eda72",
      "48445e5f90975271f982dfbabc65f442",
    ]);
  });

  test("non-hex and short hashes get real, distinct colors (no NaN)", () => {
    const inputs = ["a", "b", "hello world", "john@example.com", "jane@example.com", "user1", "user2"];
    const fills = inputs.map((h) => fill(String(new SVG(h))));
    for (const f of fills) assert.doesNotMatch(f, /NaN/);
    assert.equal(new Set(fills).size, inputs.length, "every input gets its own color");
  });

  test("rendering is deterministic per input", () => {
    assert.equal(String(new SVG("john@example.com")), String(new SVG("john@example.com")));
    assert.equal(String(new PNG("john@example.com")), String(new PNG("john@example.com")));
  });

  test("rejects non-string hashes", () => {
    for (const bad of [null, undefined, 42, {}]) {
      assert.throws(() => new SVG(bad), { name: "TypeError", message: /hash must be a string/ });
      assert.throws(() => new PNG(bad), /hash must be a string/);
    }
  });
});

describe("SVG", () => {
  test("generates markup by default", () => {
    const svg = String(new SVG(HASH));
    assert.ok(svg.startsWith("<svg xmlns="));
    assert.ok(svg.endsWith("</g></svg>"));
  });

  test("respects size", () => {
    assert.match(String(new SVG(HASH, { size: 100 })), /width='100' height='100'/);
  });

  test("percent-encodes the utf-8 data URI", () => {
    const uri = new SVG(HASH).toString(true);
    assert.ok(uri.startsWith("data:image/svg+xml;charset=utf-8,%3Csvg"));
    assert.doesNotMatch(uri.slice(uri.indexOf(",") + 1), /[<> #]/);
    assert.equal(decodeURIComponent(uri.slice(uri.indexOf(",") + 1)), String(new SVG(HASH)));
  });

  test("base64 data URI decodes to the markup", () => {
    const uri = new SVG(HASH).toString(true, true);
    assert.ok(uri.startsWith("data:image/svg+xml;base64,"));
    assert.equal(Buffer.from(uri.split(",")[1], "base64").toString("latin1"), String(new SVG(HASH)));
  });

  test("percentage padding shrinks the drawn area", () => {
    const tight = String(new SVG(HASH, { size: 100 }));
    const padded = String(new SVG(HASH, { size: 100, padding: "20%" }));
    assert.notEqual(tight, padded);
    assert.match(padded, /width='12'/);
  });
});

describe("PNG", () => {
  test("generates a data URI by default", () => {
    assert.ok(String(new PNG(HASH)).startsWith("data:image/png;base64,"));
  });

  test("toString(false) drops the preamble", () => {
    assert.ok(!new PNG(HASH).toString(false).startsWith("data:"));
  });

  test("is a valid PNG of the right size (signature, CRCs, zlib stream)", () => {
    // 256px and up need more than one deflate block; 1.x corrupted those.
    for (const size of [16, 64, 255, 256, 300, 512]) {
      const bytes = Buffer.from(new PNG(HASH, { size }).toString(false), "base64");
      const chunks = parsePNG(bytes);
      assert.equal(chunks.IHDR.readUInt32BE(0), size);
      assert.equal(chunks.IHDR.readUInt32BE(4), size);
      const pixels = inflateSync(chunks.IDAT); // throws on a bad adler32
      assert.equal(pixels.length, size * (size + 1));
      for (let row = 0; row < size; row++) {
        assert.equal(pixels[row * (size + 1)], 0, `row ${row} filter byte`);
      }
      // two palette entries in use: background and foreground
      assert.deepEqual(new Set(pixels), new Set([0, 1]));
      assert.ok(chunks.IEND);
    }
  });
});

describe("options", () => {
  test("null background and foreground mean 'use the default'", () => {
    assert.equal(String(new SVG(HASH, { background: null })), String(new SVG(HASH)));
    assert.equal(String(new SVG(HASH, { foreground: null })), String(new SVG(HASH)));
    assert.equal(String(new PNG(HASH, { background: null })), String(new PNG(HASH)));
  });

  test("foreground 0 is black, not 'derive from the hash'", () => {
    assert.equal(fill(String(new SVG(HASH, { foreground: 0 }))), "rgba(0,0,0,1)");
  });

  test("numeric colors keep leading zero channels", () => {
    assert.equal(fill(String(new SVG(HASH, { foreground: 0x00ff00 }))), "rgba(0,255,0,1)");
    assert.equal(fill(String(new SVG(HASH, { foreground: 0x0000ff }))), "rgba(0,0,255,1)");
  });

  test("never writes to the console", () => {
    const log = mock.method(console, "log", () => {});
    try {
      new SVG(HASH, { foreground: "#f00", background: "123f" });
      new PNG(HASH, { foreground: "abc" });
      assert.equal(log.mock.callCount(), 0);
    } finally {
      log.mock.restore();
    }
  });
});

describe("colorToArray", () => {
  test("parses hex colors of length 1, 2, 3, 4, 6 and 8", () => {
    assert.deepEqual(colorToArray("f"), [255, 255, 255, 255]);
    assert.deepEqual(colorToArray("f8"), [255, 255, 255, 136]);
    assert.deepEqual(colorToArray("#fff"), [255, 255, 255, 255]);
    assert.deepEqual(colorToArray("123f"), [17, 34, 51, 255]);
    assert.deepEqual(colorToArray("336699"), [51, 102, 153, 255]);
    assert.deepEqual(colorToArray("33669980"), [51, 102, 153, 128]);
    assert.deepEqual(colorToArray(""), [0, 0, 0, 255]);
  });

  test("parses numbers as 0xRRGGBB, or 0xRRGGBBAA above 0xffffff", () => {
    assert.deepEqual(colorToArray(0xffffff), [255, 255, 255, 255]);
    assert.deepEqual(colorToArray(0x00ff00), [0, 255, 0, 255]);
    assert.deepEqual(colorToArray(0), [0, 0, 0, 255]);
    assert.deepEqual(colorToArray(0xff000080), [255, 0, 0, 128]);
  });

  test("passes arrays through, defaulting alpha to 255", () => {
    assert.deepEqual(colorToArray([1, 2, 3]), [1, 2, 3, 255]);
    assert.deepEqual(colorToArray([1, 2, 3, 4]), [1, 2, 3, 4]);
  });

  test("rejects bad input", () => {
    assert.throws(() => colorToArray("12345"), /not supported/);
    assert.throws(() => colorToArray("123456789"), /not supported/);
    assert.throws(() => colorToArray("red"), /not a hex color/);
    assert.throws(() => colorToArray(-1), RangeError);
    assert.throws(() => colorToArray(1.5), RangeError);
    assert.throws(() => colorToArray([1, 2]), TypeError);
    assert.throws(() => colorToArray(null), TypeError);
  });
});

describe("hsl2rgb", () => {
  test("converts hue/saturation/lightness to rgb", () => {
    assert.deepEqual(hsl2rgb(0, 1, 0.5).map(Math.round), [255, 0, 0]);
    assert.deepEqual(hsl2rgb(1 / 3, 1, 0.5).map(Math.round), [0, 255, 0]);
  });
});

describe("extending Graphic", () => {
  test("a subclass can add an output format", () => {
    class Text extends GraphicSubpath {
      renderImage(hash, size, padding, background, foreground) {
        const grid = [];
        const image = { color: (c) => (c === background ? "." : "#") };
        render(hash, { size: 5, padding: 0, background, foreground }, image, (x, y, w, h, color) => {
          (grid[y] ??= Array(5).fill(" "))[x] = color;
        });
        return grid.map((row) => row.join("")).join("\n");
      }
      toString() {
        return this.image;
      }
    }
    assert.equal(GraphicSubpath, Graphic);
    const out = String(new Text(HASH));
    assert.equal(out.split("\n").length, 5);
    assert.match(out, /^[.#]{5}(\n[.#]{5}){4}$/);
    // mirrored left to right
    for (const row of out.split("\n")) assert.equal(row, [...row].reverse().join(""));
  });
});
