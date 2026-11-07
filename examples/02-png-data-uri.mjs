// A PNG as a data URI, ready for <img src>. Pass false for bare base64, for
// example to write a file.
import assert from "node:assert/strict";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PNG } from "@johnhenry/sigil";

const icon = new PNG("ada@example.com", { size: 256 });
const uri = String(icon);
assert.ok(uri.startsWith("data:image/png;base64,"));

const file = join(mkdtempSync(join(tmpdir(), "sigil-")), "ada.png");
const bytes = Buffer.from(icon.toString(false), "base64");
writeFileSync(file, bytes);
assert.equal(bytes.toString("latin1", 1, 4), "PNG");
console.log(`<img src="${uri.slice(0, 40)}…">`);
console.log(`wrote ${bytes.length} bytes to ${file}`);
