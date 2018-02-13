## Classes

<dl>
<dt><a href="#SVG">SVG</a> ⇐ <code>lidenticons/graphic</code></dt>
<dd></dd>
<dt><a href="#PNG">PNG</a> ⇐ <code>lidenticons/graphic</code></dt>
<dd></dd>
</dl>

<a name="SVG"></a>

## SVG ⇐ <code>lidenticons/graphic</code>
**Kind**: global class  
**Extends**: <code>lidenticons/graphic</code>  
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

## PNG ⇐ <code>lidenticons/graphic</code>
**Kind**: global class  
**Extends**: <code>lidenticons/graphic</code>  
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
