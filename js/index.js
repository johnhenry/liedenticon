/* eslint-disable */

/**
 * Lidenticon 0.0.0
 * http://github.com/johnhenry/lidenticon
 * @copyright Copyright (c) 2017, John Henry
 * @copyright Copyright (c) 2017, Stewart Lord
 * @copyright Copyright (c) 2010, Robert Eisele <robert@xarg.org>
 * Released under the BSD license
 * http://www.opensource.org/licenses/bsd-license.php
 */

/**
 * @class SVG
 * @description A hash represented as an SVG
 * @param {string} hash - unique string
 * @param {object} options - graphicical options
 * @extends lidenticons/graphic
 * @example
 * import {SVG} from "Liedenticon";
 * const svg = document.createElement("SVG");
 * document.appendChild(svg);
 * svg.outerHTML = new SVG("efb8c90a13f7a1fdc4910");
 */
export { default as SVG } from "./svg/index.js";

/**
 * @class PNG
 * @description A hash represented as an PNG
 * @param {string} hash - unique string
 * @param {object} options - graphicical options
 * @extends lidenticons/graphic
 * @example
 * import {PNG} from "Liedenticon";
 * const img = document.createElement("IMG");
 * img.src = new PNG("efb8c90a13f7a1fdc4910");
 * document.appendChild(img);
 */
export { default as PNG } from "./png/index.js";

//# sourceMappingURL=index.js.map
