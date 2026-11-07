const encoder = new TextEncoder();

/**
 * Turn any string into 32 hex digits, deterministically and synchronously.
 *
 * Four FNV-1a passes over the UTF-8 bytes, each with its own offset basis and
 * a murmur3 finalizer so that similar inputs ("user1", "user2") look nothing
 * alike. This is NOT a cryptographic hash: it only spreads arbitrary strings
 * (usernames, emails) across the identicon space.
 *
 * The output is part of the public contract. Changing it changes every
 * non-hex identicon, so test/liedenticon.test.mjs pins test vectors.
 *
 * @param {string} text
 * @returns {string}
 */
export default function digest(text) {
  const bytes = encoder.encode(text);
  let out = "";
  for (let seed = 1; seed <= 4; seed++) {
    let h = (0x811c9dc5 ^ Math.imul(seed, 0x9e3779b9)) >>> 0;
    for (const byte of bytes) {
      h ^= byte;
      h = Math.imul(h, 0x01000193);
    }
    h ^= h >>> 16;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    out += (h >>> 0).toString(16).padStart(8, "0");
  }
  return out;
}
