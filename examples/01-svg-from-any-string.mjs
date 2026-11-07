// Any string works: an email, a username, a hex digest. The same input always
// gives the same icon, and different inputs get different colors.
import assert from "node:assert/strict";
import { SVG } from "@johnhenry/liedenticon";

const icons = ["ada@example.com", "grace@example.com", "d6fe8c82fb0abac17a702fd2a94eff37"].map(
  (id) => [id, String(new SVG(id, { size: 48 }))]
);

for (const [id, svg] of icons) {
  assert.ok(svg.startsWith("<svg"));
  assert.equal(svg, String(new SVG(id, { size: 48 })), "deterministic");
  console.log(id.padEnd(34), svg.match(/fill:(rgba\([^)]*\))/)[1]);
}
assert.equal(new Set(icons.map(([, svg]) => svg)).size, icons.length, "distinct");
