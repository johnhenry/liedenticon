# Examples

Each example is self-checking: it asserts what it shows and exits non-zero if
that stops being true. Run one with `npm run example:NN`, or all of them with
`npm run examples` (CI does).

| Example | Demonstrates |
| --- | --- |
| [01-svg-from-any-string.mjs](01-svg-from-any-string.mjs) | Any string (email, username, hex digest) gives a deterministic SVG, and different strings get different colors |
| [02-png-data-uri.mjs](02-png-data-uri.mjs) | A PNG as an `<img src>` data URI, and as bare bytes written to a file (256px, which needs multi-block deflate) |
| [03-custom-colors-and-padding.mjs](03-custom-colors-and-padding.mjs) | Hex, numeric and array colors, and percentage padding |
| [04-new-output-format.mjs](04-new-output-format.mjs) | Subclassing `Graphic` (from `@johnhenry/sigil/graphic`) to add a new output format |
