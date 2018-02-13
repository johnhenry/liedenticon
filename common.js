'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

//     
const padding         = 0;
const size         = 64;
const saturation         = 0.75;
const brightness         = 0.5;
const background                                                     = [
  0,
  0,
  0,
  0
];
const foreground 
                    
          
          
                  = undefined;




var defaults = Object.freeze({
	padding: padding,
	size: size,
	saturation: saturation,
	brightness: brightness,
	background: background,
	foreground: foreground
});

//     
var hsl2rgb = (h        , s        , b        ) => {
  h *= 6;
  const S = [
    (b += s *= b < 0.5 ? b : 1 - b),
    b - (h % 1) * s * 2,
    (b -= s *= 2),
    b,
    b + (h % 1) * s,
    b + s
  ];

  return [
    S[~~h % 6] * 255, // red
    S[(h | 16) % 6] * 255, // green
    S[(h | 8) % 6] * 255 // blue
  ];
};

//     
const render = (
  hash        ,
  { size: size$$1, padding: padding$$1, background: background$$1, foreground: foreground$$1 }             ,
  image     ,
  rectangle          
) => {
  let baseMargin = Math.floor(size$$1 * padding$$1);
  let cell = Math.floor((size$$1 - baseMargin * 2) / 5);
  padding$$1 = Math.floor((size$$1 - cell * 5) / 2);
  let bg = image.color(background$$1);
  let fg = image.color(foreground$$1);

  // the first 15 characters of the hash control the pixels (even/odd)
  // they are drawn down the middle first, then mirrored outwards
  let i, color;
  for (i = 0; i < 15; i++) {
    color = parseInt(hash.charAt(i), 16) % 2 ? bg : fg;
    if (i < 5) {
      rectangle(
        2 * cell + padding$$1,
        i * cell + padding$$1,
        cell,
        cell,
        color,
        image
      );
    } else if (i < 10) {
      rectangle(
        1 * cell + padding$$1,
        (i - 5) * cell + padding$$1,
        cell,
        cell,
        color,
        image
      );
      rectangle(
        3 * cell + padding$$1,
        (i - 5) * cell + padding$$1,
        cell,
        cell,
        color,
        image
      );
    } else if (i < 15) {
      rectangle(
        0 * cell + padding$$1,
        (i - 10) * cell + padding$$1,
        cell,
        cell,
        color,
        image
      );
      rectangle(
        4 * cell + padding$$1,
        (i - 10) * cell + padding$$1,
        cell,
        cell,
        color,
        image
      );
    }
  }
  return image;
};
class Graphic {
             
  constructor(
    hash        ,
    {
      size: size$$1 = size,
      padding: padding$$1 = padding,
      saturation: saturation$$1 = saturation,
      brightness: brightness$$1 = brightness,
      background: background$$1 = background,
      foreground: foreground$$1 = foreground
    }               = defaults
  ) {
    if (typeof hash !== "string" || hash.length < 15) {
      throw "A hash of at least 15 characters is required.";
    }
    if (typeof padding$$1 === "string") {
      const index = padding$$1.indexOf("%");
      if (index > 0) {
        padding$$1 = padding$$1.substr(0, index);
        padding$$1 = Number(padding$$1) / 100;
      } else {
        padding$$1 = Number(padding$$1);
      }
    }
    // foreground defaults to last 7 chars as hue at 70% saturation, 50% brightness
    foreground$$1 =
      foreground$$1 ||
      hsl2rgb(
        parseInt(hash.substr(-7), 16) / 0xfffffff,
        saturation$$1,
        brightness$$1
      );
    this.image = this.renderImage(hash, size$$1, padding$$1, background$$1, foreground$$1);
  }
  renderImage(
    hash        ,
    size$$1        ,
    padding$$1        ,
    background$$1                                 ,
    foreground$$1                                 
  ) {
    return null;
  }
}

//     
var colorToArray = (input                 ) => {
  let red = 0;
  let green = 0;
  let blue = 0;
  let alpha = 255;
  if (typeof input === "string") {
    if (input[0] === "#") {
      input = input.substr(1);
    }
  } else if (typeof input === "number") {
    input = input.toString(16);
  }
  if (!input.length) {
    return [red, green, blue, alpha];
  }

  if (input.length === 5 || input.length === 7 || input.length > 8) {
    throw new Error(`color of length ${input.length} not supported`);
  }

  if (input.length < 3) {
    //1,2
    red = green = blue = parseInt(input[0].repeat(2), 16);
    if (input.length > 1) {
      alpha = parseInt(input[1].repeat(2), 16);
    }
  } else if (input.length < 5) {
    console.log(input);
    //3, 4
    red = parseInt(input.substr(0, 1).repeat(2), 16);
    green = parseInt(input.substr(1, 1).repeat(2), 16);
    blue = parseInt(input.substr(2, 1).repeat(2), 16);
    if (input.length > 3) {
      alpha = parseInt(input.substr(3, 1).repeat(2), 16);
    }
  } else if (input.length < 9) {
    //6, 8
    red = parseInt(input.substr(0, 2), 16);
    green = parseInt(input.substr(2, 2), 16);
    blue = parseInt(input.substr(4, 2), 16);
    if (input.length > 6) {
      alpha = parseInt(input.substr(6, 2), 16);
    }
  } else {
    throw new Error(`color of length ${input.length} not supported`);
  }
  return [red, green, blue, alpha];
};

//     
class Image {
               
                     
                     
                         
  constructor(
    size        ,
    foreground                                 ,
    background                                 
  ) {
    this.size = size;
    this.foreground = this.color(foreground);
    this.background = this.color(background);
    this.rectangles = [];
  }
  color(input                                 ) {
    if (typeof input !== "object") {
      input = colorToArray(input);
    }
    const [r, g, b, a] = input;
    const values = [r, g, b].map(Math.round);
    values.push(a >= 0 && a <= 255 ? a / 255 : 1);
    return "rgba(" + values.join(",") + ")";
  }
  getDump()         {
    var i,
      xml,
      rect,
      fg = this.foreground,
      bg = this.background,
      stroke = this.size * 0.005;

    xml =
      "<svg xmlns='http://www.w3.org/2000/svg'" +
      " width='" +
      this.size +
      "' height='" +
      this.size +
      "'" +
      " style='background-color:" +
      bg +
      ";'>" +
      "<g style='fill:" +
      fg +
      "; stroke:" +
      fg +
      "; stroke-width:" +
      stroke +
      ";'>";

    for (i = 0; i < this.rectangles.length; i++) {
      rect = this.rectangles[i];
      if (rect.color == bg) continue;
      xml +=
        "<rect " +
        " x='" +
        rect.x +
        "'" +
        " y='" +
        rect.y +
        "'" +
        " width='" +
        rect.w +
        "'" +
        " height='" +
        rect.h +
        "'" +
        "/>";
    }
    xml += "</g></svg>";

    return xml;
  }
  getBase64()         {
    return btoa(this.getDump());
  }
}

//     
const rectangle = (x, y, w, h, color, image) => {
  image.rectangles.push({ x: x, y: y, w: w, h: h, color: color });
};
                     
               
                  
                                              
                     
                     
                                             
  

class index extends Graphic {
  renderImage(
    hash        ,
    size        ,
    padding        ,
    background                                 ,
    foreground                                 
  ) {
    return render(
      hash,
      {
        size,
        padding,
        background,
        foreground
      },
      new Image(size, foreground, background),
      rectangle
    );
  }
  toString(preamble          = false, base64          = false) {
    if (base64) {
      return `${
        preamble ? "data:image/svg+xml;base64," : ""
      }${this.image.getBase64()}`;
    } else {
      return `${
        preamble ? "data:image/svg+xml;utf8," : ""
      }${this.image.getDump()}`;
    }
  }
}

//     
// helper functions for that ctx
const write = (buffer, offset, ...strings) => {
  for (const string of strings) {
    for (var j = 0; j < string.length; j++) {
      buffer[offset++] = string.charAt(j);
    }
  }
};

const byte2 = w => {
  return String.fromCharCode((w >> 8) & 255, w & 255);
};

const byte4 = w => {
  return String.fromCharCode(
    (w >> 24) & 255,
    (w >> 16) & 255,
    (w >> 8) & 255,
    w & 255
  );
};

const byte2lsb = w => {
  return String.fromCharCode(w & 255, (w >> 8) & 255);
};

// modified from original source to support NPM
class Image$1 {
                
                 
                
              
                   
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                      
                     
                  
                 
                     
                  
                  
  constructor(width        , height        , depth        ) {
    this.width = width;
    this.height = height;
    this.depth = depth;

    // pixel data and row filter identifier size
    this.pix_size = height * (width + 1);

    // deflate header, pix_size, block headers, adler32 checksum
    this.data_size =
      2 + this.pix_size + 5 * Math.floor((0xfffe + this.pix_size) / 0xffff) + 4;

    // offsets and sizes of Png chunks
    this.ihdr_offs = 0; // IHDR offset and size
    this.ihdr_size = 4 + 4 + 13 + 4;
    this.plte_offs = this.ihdr_offs + this.ihdr_size; // PLTE offset and size
    this.plte_size = 4 + 4 + 3 * depth + 4;
    this.trns_offs = this.plte_offs + this.plte_size; // tRNS offset and size
    this.trns_size = 4 + 4 + depth + 4;
    this.idat_offs = this.trns_offs + this.trns_size; // IDAT offset and size
    this.idat_size = 4 + 4 + this.data_size + 4;
    this.iend_offs = this.idat_offs + this.idat_size; // IEND offset and size
    this.iend_size = 4 + 4 + 4;
    this.buffer_size = this.iend_offs + this.iend_size; // total PNG size

    this.buffer = [];
    this.palette = new Object();
    this.pindex = 0;

    this._crc32 = [];

    // initialize buffer with zero bytes
    for (var i = 0; i < this.buffer_size; i++) {
      this.buffer[i] = "\x00";
    }

    // initialize non-zero elements
    write(
      this.buffer,
      this.ihdr_offs,
      byte4(this.ihdr_size - 12),
      "IHDR",
      byte4(width),
      byte4(height),
      "\x08\x03"
    );
    write(this.buffer, this.plte_offs, byte4(this.plte_size - 12), "PLTE");
    write(this.buffer, this.trns_offs, byte4(this.trns_size - 12), "tRNS");
    write(this.buffer, this.idat_offs, byte4(this.idat_size - 12), "IDAT");
    write(this.buffer, this.iend_offs, byte4(this.iend_size - 12), "IEND");

    // initialize deflate header
    var header = ((8 + (7 << 4)) << 8) | (3 << 6);
    header += 31 - header % 31;

    write(this.buffer, this.idat_offs + 8, byte2(header));

    // initialize deflate block headers
    for (var i = 0; (i << 16) - 1 < this.pix_size; i++) {
      var size, bits;
      if (i + 0xffff < this.pix_size) {
        size = 0xffff;
        bits = "\x00";
      } else {
        size = this.pix_size - (i << 16) - i;
        bits = "\x01";
      }
      write(
        this.buffer,
        this.idat_offs + 8 + 2 + (i << 16) + (i << 2),
        bits,
        byte2lsb(size),
        byte2lsb(~size)
      );
    }

    /* Create crc32 lookup table */
    for (var i = 0; i < 256; i++) {
      var c = i;
      for (var j = 0; j < 8; j++) {
        if (c & 1) {
          c = -306674912 ^ ((c >> 1) & 0x7fffffff);
        } else {
          c = (c >> 1) & 0x7fffffff;
        }
      }
      this._crc32[i] = c;
    }

    // compute the index into a png for a given pixel
    this.index = function(x, y) {
      var i = y * (this.width + 1) + x + 1;
      var j = this.idat_offs + 8 + 2 + 5 * Math.floor(i / 0xffff + 1) + i;
      return j;
    };

    // convert a color and build up the palette
    this.color = function(input) {
      if (typeof input !== "object") {
        input = colorToArray(input);
      }
      let [red, green, blue, alpha] = input;
      alpha = alpha >= 0 ? alpha : 255;
      var color = (((((alpha << 8) | red) << 8) | green) << 8) | blue;
      if (typeof this.palette[color] == "undefined") {
        if (this.pindex == this.depth) return "\x00";

        var ndx = this.plte_offs + 8 + 3 * this.pindex;

        this.buffer[ndx + 0] = String.fromCharCode(red);
        this.buffer[ndx + 1] = String.fromCharCode(green);
        this.buffer[ndx + 2] = String.fromCharCode(blue);
        this.buffer[this.trns_offs + 8 + this.pindex] = String.fromCharCode(
          alpha
        );

        this.palette[color] = String.fromCharCode(this.pindex++);
      }
      return this.palette[color];
    };
  }
  // output a PNG string, Base64 encoded
  getBase64() {
    var s = this.getDump();

    var ch =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var c1, c2, c3, e1, e2, e3, e4;
    var l = s.length;
    var i = 0;
    var r = "";

    do {
      c1 = s.charCodeAt(i);
      e1 = c1 >> 2;
      c2 = s.charCodeAt(i + 1);
      e2 = ((c1 & 3) << 4) | (c2 >> 4);
      c3 = s.charCodeAt(i + 2);
      if (l < i + 2) {
        e3 = 64;
      } else {
        e3 = ((c2 & 0xf) << 2) | (c3 >> 6);
      }
      if (l < i + 3) {
        e4 = 64;
      } else {
        e4 = c3 & 0x3f;
      }
      r += ch.charAt(e1) + ch.charAt(e2) + ch.charAt(e3) + ch.charAt(e4);
    } while ((i += 3) < l);
    return r;
  }
  // output a PNG string
  getDump() {
    // compute adler32 of output pixels + row filter bytes
    var BASE = 65521; /* largest prime smaller than 65536 */
    var NMAX = 5552; /* NMAX is the largest n such that 255n(n+1)/2 + (n+1)(BASE-1) <= 2^32-1 */
    var s1 = 1;
    var s2 = 0;
    var n = NMAX;

    for (var y = 0; y < this.height; y++) {
      for (var x = -1; x < this.width; x++) {
        s1 += this.buffer[this.index(x, y)].charCodeAt(0);
        s2 += s1;
        if ((n -= 1) == 0) {
          s1 %= BASE;
          s2 %= BASE;
          n = NMAX;
        }
      }
    }
    s1 %= BASE;
    s2 %= BASE;
    write(
      this.buffer,
      this.idat_offs + this.idat_size - 8,
      byte4((s2 << 16) | s1)
    );

    // compute crc32 of the PNG chunks
    const crc32 = (png, offs, size) => {
      var crc = -1;
      for (var i = 4; i < size - 4; i += 1) {
        crc =
          this._crc32[(crc ^ png[offs + i].charCodeAt(0)) & 0xff] ^
          ((crc >> 8) & 0x00ffffff);
      }
      write(png, offs + size - 4, byte4(crc ^ -1));
    };

    crc32(this.buffer, this.ihdr_offs, this.ihdr_size);
    crc32(this.buffer, this.plte_offs, this.plte_size);
    crc32(this.buffer, this.trns_offs, this.trns_size);
    crc32(this.buffer, this.idat_offs, this.idat_size);
    crc32(this.buffer, this.iend_offs, this.iend_size);

    // convert PNG to string
    return "\x89PNG\r\n\x1a\n" + this.buffer.join("");
  }
}

//     
const rectangle$1 = (x, y, w, h, color, image) => {
  for (let i = x; i < x + w; i++) {
    for (let j = y; j < y + h; j++) {
      image.buffer[image.index(i, j)] = color;
    }
  }
};
class index$1 extends Graphic {
  renderImage(
    hash        ,
    size        ,
    padding        ,
    background                                  ,
    foreground                                  
  ) {
    return render(
      hash,
      {
        size,
        padding,
        background,
        foreground
      },
      new Image$1(size, size, 256),
      rectangle$1
    );
  }
  toString(preamble          = true) {
    return `${
      preamble ? `data:image/png;base64,` : ""
    }${this.image.getBase64()}`;
  }
}

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

exports.SVG = index;
exports.PNG = index$1;
