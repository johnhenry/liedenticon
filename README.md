# Sigil

[![npm version](https://img.shields.io/npm/v/%40johnhenry%2Fsigil.svg)](https://www.npmjs.com/package/@johnhenry/sigil)
[![CI](https://github.com/johnhenry/sigil/actions/workflows/ci.yml/badge.svg)](https://github.com/johnhenry/sigil/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/%40johnhenry%2Fsigil.svg)](LICENSE)

Full documentation: [opensource.johnhenry.me/sigil](https://opensource.johnhenry.me/sigil/)

Turn any string into a small, symmetric, colored identicon, as SVG markup or a
PNG. The same string always gives the same image. Zero dependencies, ships as
plain ES modules, runs in Node and browsers.

```js
import { SVG, PNG } from "@johnhenry/sigil";

document.querySelector("#avatar").innerHTML = new SVG("ada@example.com");
document.querySelector("img").src = new PNG("ada@example.com", { size: 128 });
```

> Previously published as `liedenticon` (last unscoped release 1.0.1).
> Renamed to `@johnhenry/sigil` and restarted at 0.0.0 on joining the
> @johnhenry family: a new address, not a sign of immaturity. Hex hashes
> render exactly as they did in 1.0.1; see the [CHANGELOG](CHANGELOG.md)
> for what changed.

## Contents

- [Install](#install)
- [What to pass as the hash](#what-to-pass-as-the-hash)
- [SVG](#svg)
- [PNG](#png)
- [Options](#options)
- [Colors](#colors)
- [Adding a new output format](#adding-a-new-output-format)
- [Honest limitations](#honest-limitations)
- [How it differs from identicon.js](#how-it-differs-from-identiconjs)
- [Examples](#examples)
- [Family](#family)
- [License](#license)

## Install

```sh
npm install @johnhenry/sigil
```

Node 26 or newer. In a browser, import the source straight from a CDN; there is
no build step:

```html
<script type="module">
  import { SVG } from "https://cdn.jsdelivr.net/npm/@johnhenry/sigil/src/index.js";
</script>
```

## What to pass as the hash

Any string. How it's read depends on what it looks like:

- **15 or more hex digits** (an MD5, SHA-1 or SHA-256 hex digest): used as is.
  The first 15 digits pick the cells, the last 7 pick the hue. This is the
  identicon.js scheme, so a digest renders the same here as in liedenticon
  1.x.
- **Anything else** (an email, a username, a short id): first turned into 32
  hex digits by a small built-in digest, then drawn the same way. Before
  0.0.0 these strings were read as hex directly, which gave every one of them
  the same broken color.

The built-in digest is **not cryptographic**. It only spreads strings across
the icon space. If you want an icon to match another identicon tool, hash the
string the way that tool does (for example `md5(email)`) and pass the hex.

`normalizeHash(input)` returns the hex string that will actually be drawn.

## SVG

```js
import { SVG } from "@johnhenry/sigil";

const icon = new SVG("ada@example.com", { size: 48 });

String(icon);                 // "<svg xmlns='http://www.w3.org/2000/svg' …"
icon.toString(true);          // "data:image/svg+xml;charset=utf-8,%3Csvg…"
icon.toString(true, true);    // "data:image/svg+xml;base64,PHN2Zy…"
```

`toString(preamble = false, base64 = false)`: markup by default; with
`preamble`, a percent-encoded data URI for `<img src>` or CSS `url()`; with
`base64` as well, a base64 data URI.

## PNG

```js
import { PNG } from "@johnhenry/sigil";

const icon = new PNG("ada@example.com", { size: 128 });

String(icon);            // "data:image/png;base64,iVBORw0KGgo…"
icon.toString(false);    // "iVBORw0KGgo…" (bare base64)
```

`toString(preamble = true)`. Note that the default is the opposite of SVG's:
a PNG has no markup form, so the useful default is the data URI.

To write a file in Node:

```js
import { writeFile } from "node:fs/promises";
await writeFile("ada.png", Buffer.from(icon.toString(false), "base64"));
```

## Options

Both classes take the same options object as their second argument.

| Option | Default | Meaning |
| --- | --- | --- |
| `size` | `64` | Width and height in pixels. |
| `padding` | `0` | Space around the grid: a fraction of `size` (`0.2`) or a percentage string (`"20%"`). |
| `foreground` | derived | The cell color. By default a hue taken from the hash, at `saturation` and `brightness`. |
| `background` | transparent | The background color. |
| `saturation` | `0.75` | Saturation (0-1) of the derived foreground. |
| `brightness` | `0.5` | Lightness (0-1) of the derived foreground. |

`null` for `foreground` or `background` means "use the default". Cells are
whole pixels, so the grid is centered and any remainder becomes extra padding.

## Colors

`foreground` and `background` accept:

- **hex strings** of 1, 2, 3, 4, 6 or 8 digits, with or without `#`. 1 and 2
  digits are greys (`"f"`, `"f8"`); the 2, 4 and 8 digit forms carry alpha.
- **numbers**: `0xRRGGBB`, or `0xRRGGBBAA` when larger than `0xffffff`.
  Leading zero channels are kept (`0x00ff00` is green).
- **arrays**: `[r, g, b]` or `[r, g, b, a]`, each 0-255.

`colorToArray(color)` is exported and returns `[r, g, b, a]`.

## Adding a new output format

`SVG` and `PNG` both extend `Graphic`, which validates options and derives the
colors, then calls `renderImage`. The exported `render` helper walks the
mirrored 5x5 grid and calls your `rectangle` function once per cell. A new
format implements `renderImage` and `toString`:

```js
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
```

`render` calls `image.color(background)` and `image.color(foreground)` once
each and passes whichever result applies to `rectangle`. The full, runnable
version is [examples/04-new-output-format.mjs](examples/04-new-output-format.mjs).

## Honest limitations

- **Not a security feature.** An identicon helps people tell accounts apart at
  a glance; it does not prove identity. The grid has 2^15 patterns and
  similar hues are easy to confuse, so two different strings can look alike.
- **The built-in digest is not cryptographic** (see
  [What to pass as the hash](#what-to-pass-as-the-hash)). Don't use
  `normalizeHash` for anything but icons.
- **Changing the digest would change icons.** Its output is pinned by tests;
  a change to it would be a breaking release.
- **The PNG encoder doesn't compress.** It writes stored (uncompressed)
  deflate blocks, so a 256px PNG is about 66 KB. Use SVG when size matters,
  or re-encode the PNG.
- **`0xRRGGBBAA` numbers can't express a zero red channel with alpha**:
  `0x00ff00ff` is the number `0xff00ff`, which reads as opaque magenta. Use a
  string (`"#00ff00ff"`) or an array for colors with alpha.

## How it differs from identicon.js

Sigil started (as liedenticon) as an extension of
[identicon.js](https://github.com/stewartlord/identicon.js) and keeps its grid
and color scheme. It adds:

- separate `SVG` and `PNG` classes, and a `Graphic` base class for new formats;
- any string as input, not only hex digests;
- colors as hex strings of any supported length, numbers or arrays;
- `padding` (as a fraction or percentage) instead of `margin`;
- data URI output for both formats.

## Examples

Self-checking examples live in [examples/](examples/README.md). Run them all
with `npm run examples`.

## Family

Sigil is a leaf in the @johnhenry family: it doesn't depend on any
sibling package, and no sibling depends on it. Its output is a plain SVG
string or a PNG data URI, so it drops into anything that takes markup or an
image URL.

- **[`johnhenry/lib`](https://github.com/johnhenry/lib)** vendors an older
  copy of this package (as liedenticon) as a standalone module. This repository is the
  canonical source.

## License

MIT for John Henry's work, together with the BSD licenses of identicon.js
(Stewart Lord) and PNGlib (Robert Eisele), from which parts of this package
are derived. All three notices are in [LICENSE](LICENSE).
