# Agent playbook

`@johnhenry/liedenticon` turns any string into a symmetric 5x5 identicon, as
SVG markup or a PNG. Single package, Node >= 26, zero dependencies, plain ES
modules shipped as source (no build step: `exports` points straight at
`src/`), `node --test` (`npm test`).

`CLAUDE.md` in this directory is a symlink to this file.

## The verification loop (before every push)

CI (`.github/workflows/ci.yml`) runs these in this order; match it locally.

1. `npm test`. Includes the golden test: every hex hash in
   `test/fixtures/golden-1.0.1.json` must still render byte-identically to
   liedenticon 1.0.1 (SVG, base64 SVG and PNG).
2. `npm run examples`. Every example asserts what it shows.
3. `npm pack --dry-run`. Read the file list: `src/`, `index.d.ts`,
   `graphic.d.ts`, `README.md`, `LICENSE`, `CHANGELOG.md`, `package.json`.
4. If you touched `index.d.ts` or `graphic.d.ts`, typecheck a consumer with
   `strict` and `moduleResolution: nodenext` (there is no tsconfig in the
   repo; use a scratch project that links the package).
5. A fresh clone:
   `git clone . /tmp/liedenticon-verifyN && cd $_ && npm install && npm test`.

## Repo-specific gotchas

- **Output is the contract.** Users store or compare these images, so any
  change to what a given input draws is a breaking change. Two tests guard it:
  the golden fixture (hex hashes match 1.0.1) and the pinned `digest` vectors
  (non-hex strings). Regenerate either only for a deliberate, CHANGELOG'd
  output change.
- **Hex hashes bypass the digest on purpose.** `normalizeHash` uses a string
  of 15+ hex digits as is, which keeps 1.x output stable. Don't "simplify" it
  by digesting everything.
- **The PNG encoder is a hand-rolled stored-deflate writer** (from PNGlib).
  Images of 256px and larger span several deflate blocks, and 1.x corrupted
  exactly those. The PNG test inflates the output with `node:zlib` and checks
  every chunk CRC at sizes on both sides of that boundary; keep it that way.
- **Use `??`, not `||`, for option defaults.** `0` is black and `null` means
  "default"; `||` broke both in 1.x.
- **No console output and no dependencies.** A test fails on any
  `console.log`; there is no runtime or dev dependency, and adding one needs
  a written reason.
- **The license is `MIT AND BSD-2-Clause`.** Keep the identicon.js and PNGlib
  notices in `LICENSE` and the attribution in `src/index.js`.

## Definition of done

- `npm test` and `npm run examples` pass, with a regression test for any bug
  fixed.
- `index.d.ts` matches any API change.
- README describes the behavior, and anything it doesn't do goes under
  `## Honest limitations`.
- `CHANGELOG.md` has a dated entry citing the commit and PR.

## Non-goals

- Compression in the PNG encoder. Stored blocks keep it tiny and dependency
  free; use SVG, or re-encode, when bytes matter.
- Matching other identicon libraries' output for non-hex input. Pass their
  hex digest (for example `md5(email)`) for that.

## Releases

`main` is the release branch. Bump `version` in `package.json` and add the
dated `CHANGELOG.md` entry in a PR; merging it publishes through
`.github/workflows/publish.yml` (npm trusted publishing, idempotent `npm view`
guard), which then creates the `v<version>` tag and GitHub Release. Don't run
`gh release create`. Don't rename `publish.yml`: npm trusted publishing is
bound to that filename.
