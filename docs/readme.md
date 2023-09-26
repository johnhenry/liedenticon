# Liedenticon

Transform a string into a unique image.

## Liedenticons vs Identicons

Liedenticon is a ~~ripoff of~~ extension of [Identicon](https://github.com/stewartlord/identicon.js/tree/master) with a few major differences.

### Modules

Liedenticon separates image generation into two separate classes. One to generate SVGs and another to generate PNGs.

#### Common JS Module

```javascript
const {SVG, PNG} = require("liedenticon");
```

#### ES6 Module

```javascript
import { SVG, PNG } from "liedenticon/js";
```


#### ES6 Module
```html
<script src="../vendor/liedenticon/browser.js"></script>
<script>
  const {SVG, PNG} = window.Liedenticon;
</script>
```


#### SVG Class

By default the SVG module will generate an svg string to be embedded in a document.

```javascript
console.log(new SVG("...")); //logs "<svg ..."
```

Passing a truthy paramater to the "toString" method will create a string that can be used
directly as the source attribute of an image.

```javascript
console.log(new SVG("...").toString(true)); //logs "data:image/svg+xml;utf8,<svg ..."
```

Passing a second truthy paramater returns the base 64 encoded string.

```javascript
console.log(new SVG("...").toString(true, true)); //logs "data:image/svg+xml;base64,..."
```

#### PNG ModuClassle

The PNG module will generate a base64 string by default with a preamble attached.

```javascript
console.log(new SVG("...")); //logs "data:image/svg+png;base64,..."
```

Passing a falsy parameter to "toString" method will drop the preamble.

```javascript
console.log(new SVG("...").toString(false)); //logs "..."
```

#### Future

Both the SVG and PNG modules both inherit from an internal class called Graphic.
It should be easy to extend this object and support other fomats by implementing
a "renderImage" and a "toString" method.

```javascript
import Graphics from "Liedenticon/graphic";
class NewFormat extends Graphics {
  renderImage(hash, size, padding, background, foreground) {
    //...
  }
  toString() {
    //...
  }
}
```

### Color Support

In addition to using an array for colors, Liedenticon supports 1, 2, 3, 4, 6, and 8 digit hex color codes.
2, 4, and 8 digit colors support alpha channels

### Padding vs Margin

We've replaced the "margin" option "padding" as it this more closely fits this [definition](https://www.w3schools.com/cSS/css_padding.asp) used by most web developers.

#### Padding Percentage

Padding also supports values given as percentage strings.

```javascript
const svg = new SVG("...", { padding: "20%" });
```

## Classes

<dl>
<dt><a href="#SVG">SVG</a> ⇐ <code>liedenticons/graphic</code></dt>
<dd></dd>
<dt><a href="#PNG">PNG</a> ⇐ <code>liedenticons/graphic</code></dt>
<dd></dd>
</dl>

<a name="SVG"></a>

## SVG ⇐ <code>liedenticons/graphic</code>
**Kind**: global class  
**Extends**: <code>liedenticons/graphic</code>  
<a name="new_SVG_new"></a>

### new SVG(hash, options)
A hash represented as an SVG


| Param | Type | Description |
| --- | --- | --- |
| hash | <code>string</code> | unique string |
| options | <code>object</code> | graphicical options |

**Example**  
```js
import {SVG} from "Liedenticon";
const svg = document.createElement("SVG");
document.appendChild(svg);
svg.outerHTML = new SVG("efb8c90a13f7a1fdc4910");
```
<a name="PNG"></a>

## PNG ⇐ <code>liedenticons/graphic</code>
**Kind**: global class  
**Extends**: <code>liedenticons/graphic</code>  
<a name="new_PNG_new"></a>

### new PNG(hash, options)
A hash represented as an PNG


| Param | Type | Description |
| --- | --- | --- |
| hash | <code>string</code> | unique string |
| options | <code>object</code> | graphicical options |

**Example**  
```js
import {PNG} from "Liedenticon";
const img = document.createElement("IMG");
img.src = new PNG("efb8c90a13f7a1fdc4910");
document.appendChild(img);
```
