import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { SVG, PNG } from "../js/index.js";
import colorToArray from "../js/color-to-array.js";
import hsl2rgb from "../js/hsl2rgb.js";

const HASH = "efb8c90a13f7a1fdc4910";

describe("liedenticon SVG", () => {
  test("generates an svg string by default", () => {
    const svg = String(new SVG(HASH));
    assert.ok(svg.startsWith("<svg xmlns="));
    assert.ok(svg.endsWith("</svg>"));
    assert.ok(svg.includes("<rect"));
  });
  test("prepends a data-URI preamble when toString is passed true", () => {
    assert.ok(
      new SVG(HASH).toString(true).startsWith("data:image/svg+xml;utf8,<svg")
    );
  });
  test("base64 encodes when toString is passed two truthy arguments", () => {
    const output = new SVG(HASH).toString(true, true);
    assert.ok(output.startsWith("data:image/svg+xml;base64,"));
    const decoded = Buffer.from(
      output.slice("data:image/svg+xml;base64,".length),
      "base64"
    ).toString("utf8");
    assert.equal(decoded, new SVG(HASH).toString());
  });
  test("is deterministic per hash and varies across hashes", () => {
    assert.equal(String(new SVG(HASH)), String(new SVG(HASH)));
    assert.notEqual(
      String(new SVG(HASH)),
      String(new SVG("000000000000000000000"))
    );
  });
  test("honors size, foreground, and percentage padding options", () => {
    const svg = String(
      new SVG(HASH, { size: 128, padding: "20%", foreground: "#36c" })
    );
    assert.ok(svg.includes("width='128'"));
    assert.ok(svg.includes("height='128'"));
    assert.ok(svg.includes("rgba(51,102,204,1)"));
  });
  test("rejects non-string hashes", () => {
    assert.throws(() => new SVG(12345), /hash must be a string/);
  });
});

describe("liedenticon PNG", () => {
  test("generates a base64 data URI by default", () => {
    const output = String(new PNG(HASH));
    assert.ok(output.startsWith("data:image/png;base64,"));
  });
  test("drops the preamble when toString is passed false", () => {
    const raw = new PNG(HASH).toString(false);
    assert.ok(!raw.startsWith("data:"));
    const bytes = Buffer.from(raw, "base64");
    // PNG magic number
    assert.deepEqual([...bytes.subarray(0, 4)], [0x89, 0x50, 0x4e, 0x47]);
  });
  test("is deterministic per hash", () => {
    assert.equal(String(new PNG(HASH)), String(new PNG(HASH)));
  });
  test("rejects non-string hashes", () => {
    assert.throws(() => new PNG(null), /hash must be a string/);
  });
});

describe("liedenticon colorToArray", () => {
  test("parses hex colors of length 1, 2, 3, 4, 6, and 8", () => {
    assert.deepEqual(colorToArray("f"), [255, 255, 255, 255]);
    assert.deepEqual(colorToArray("f8"), [255, 255, 255, 136]);
    assert.deepEqual(colorToArray("#fff"), [255, 255, 255, 255]);
    assert.deepEqual(colorToArray("123f"), [17, 34, 51, 255]);
    assert.deepEqual(colorToArray("336699"), [51, 102, 153, 255]);
    assert.deepEqual(colorToArray("33669980"), [51, 102, 153, 128]);
  });
  test("parses numeric input as hex", () => {
    assert.deepEqual(colorToArray(0xffffff), [255, 255, 255, 255]);
  });
  test("rejects unsupported lengths", () => {
    assert.throws(() => colorToArray("12345"), /not supported/);
    assert.throws(() => colorToArray("123456789"), /not supported/);
  });
});

describe("liedenticon hsl2rgb", () => {
  test("converts hue/saturation/brightness to rgb", () => {
    const [r, g, b] = hsl2rgb(0, 1, 0.5);
    assert.equal(Math.round(r), 255);
    assert.equal(Math.round(g), 0);
    assert.equal(Math.round(b), 0);
  });
});
