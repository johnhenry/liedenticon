# Changelog

## 0.0.0 — joins the @johnhenry family, renamed `@johnhenry/sigil` (2026-11-07)

Previously published as `liedenticon`, last unscoped release 1.0.1. This is
the first release under the new name (both the scope and the base name
changed; the GitHub repo moved from `johnhenry/liedenticon` to
`johnhenry/sigil`, and the old URL redirects); the version restarts at 0.0.0 for a
new address, not because the code is new. Install `@johnhenry/sigil`
instead of `liedenticon`. Everything below landed in #3.

### Will my existing icons look the same? For hex digests, yes.

A hash of 15 or more hex digits (an MD5 or SHA digest, the documented input)
renders byte-for-byte as it did in 1.0.1, as SVG, base64 SVG and PNG, for
images under 256px. `test/fixtures/golden-1.0.1.json` pins this. Other
strings now render differently, because 1.0.1 drew all of them wrong (see
below). PNGs of 256px and larger change too, because 1.0.1 produced corrupt
files at those sizes.

### Can I keep using `require("liedenticon")`? No.

The package is now ES modules only, with `exports` for `.` and `./graphic`.
Node 26 can `require()` it; older toolchains need `import`. The old
`common.js`, `browser.js` (IIFE global `Liedenticon`), `js/` and `mjs/` builds
are gone: import `src/index.js`, or load it from a CDN as a module.

### Fixed

- **Strings that aren't 15+ hex digits all got the same broken color.** The
  hue came from reading the last 7 characters as hex, so emails, usernames
  and short ids produced `NaN` color channels (`rgba(223,NaN,32,1)` for every
  one of them), and their non-hex characters always drew as foreground. They
  are now digested to 32 hex digits first (`normalizeHash`), so each gets its
  own color and pattern.
- **PNGs of 256px and larger were corrupt.** Their pixel data needs more than
  one deflate block, and the encoder (inherited from PNGlib) wrote the wrong
  length into the second and later block headers. Image viewers and zlib
  rejected the result.
- **Numeric colors lost leading zero channels.** `0x00ff00` was read as the
  4-digit color `"ff00"` (transparent yellow) and `0x0000ff` as white. Numbers
  are now zero-padded to 6 digits (8 above `0xffffff`).
- **`foreground: 0` (black) was ignored** in favor of the derived hue, because
  the default was applied with `||`. It now uses `??`.
- **`background: null` threw** "input is not iterable". `null` now means "use
  the default" for both colors.
- **Every 3- or 4-digit hex color was printed to the console** by a leftover
  `console.log`.
- **The `mjs/` build was stale**: it lacked 1.0.1's hash validation that the
  other builds had. There is now one source and no build.
- **The SVG `utf8` data URI wasn't URL-encoded.** `toString(true)` now returns
  `data:image/svg+xml;charset=utf-8,` followed by percent-encoded markup.
- **Bad colors fail clearly.** Non-hex strings, non-integer or negative
  numbers, and arrays that aren't 3 or 4 numbers throw instead of drawing
  `NaN`.

### Added

- `normalizeHash`, `colorToArray`, `render` and `Graphic` exports, and the
  `@johnhenry/sigil/graphic` subpath for writing new output formats.
- TypeScript declarations (`index.d.ts`, `graphic.d.ts`).
- Self-checking examples (`examples/01`–`04`, `npm run examples`).
- A `LICENSE` file. 1.x had none, and its `package.json` said MIT while the
  code carried identicon.js's and PNGlib's BSD notices. The license is now
  `MIT AND BSD-2-Clause`, with all three notices in `LICENSE`.
- Documentation at
  [opensource.johnhenry.me/sigil](https://opensource.johnhenry.me/sigil/).

### Changed

- Default branch renamed from `master` to `main`, the release branch.
  Publishing goes through `.github/workflows/publish.yml` and
  `johnhenry/workflows` with npm provenance; the token-based
  `npm-publish.yaml` is gone.
- The Flow, Babel, Rollup, ESLint and git-hooks toolchain (all from 2017) is
  removed. The package has no dependencies of any kind.
