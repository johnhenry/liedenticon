/**
 * A color: a hex string of 1, 2, 3, 4, 6 or 8 digits (with or without `#`),
 * a number (`0xRRGGBB`, or `0xRRGGBBAA` above `0xffffff`), or an
 * `[r, g, b]` / `[r, g, b, a]` array of 0-255 values.
 */
export type Color = string | number | [number, number, number] | [number, number, number, number];

export interface Options {
  /** Width and height in pixels. Default 64. */
  size?: number;
  /** Space around the grid, as a fraction of `size` (0.2) or a percentage string ("20%"). Default 0. */
  padding?: number | string;
  /** Saturation of the derived foreground, 0-1. Default 0.75. Ignored when `foreground` is set. */
  saturation?: number;
  /** Lightness of the derived foreground, 0-1. Default 0.5. Ignored when `foreground` is set. */
  brightness?: number;
  /** Default: fully transparent. `null` means the default. */
  background?: Color | null;
  /** Default: a hue derived from the hash. `null` means the default. */
  foreground?: Color | null;
}

/** Base class for an output format. Implement `renderImage` and `toString`. */
export class Graphic<Image = unknown> {
  /**
   * @param hash Any string. Hex strings of 15+ digits are used as they are;
   *   anything else is digested first.
   */
  constructor(hash: string, options?: Options);
  image: Image;
  renderImage(
    hash: string,
    size: number,
    padding: number,
    background: Color,
    foreground: Color
  ): Image;
}

export class SVG extends Graphic {
  /**
   * Markup by default. `preamble` returns a percent-encoded
   * `data:image/svg+xml;charset=utf-8,` URI; with `base64` too, a
   * `data:image/svg+xml;base64,` URI.
   */
  toString(preamble?: boolean, base64?: boolean): string;
}

export class PNG extends Graphic {
  /** A `data:image/png;base64,` URI by default; `false` returns bare base64. */
  toString(preamble?: boolean): string;
}

/** Draw the mirrored 5x5 grid onto `image`, calling `rectangle` once per cell. */
export function render<Image extends { color(input: Color): unknown }>(
  hash: string,
  options: { size: number; padding: number; background: Color; foreground: Color },
  image: Image,
  rectangle: (x: number, y: number, width: number, height: number, color: unknown, image: Image) => void
): Image;

/** The hash a `Graphic` actually draws: the input if it is 15+ hex digits, else its 32-digit digest. */
export function normalizeHash(hash: string): string;

/** Normalize a `Color` to `[r, g, b, a]`. */
export function colorToArray(input: Color): [number, number, number, number];
