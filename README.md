# D3Evolution
Simple reusable evolution d3 chart

Live demo is available at http://moisseev.github.io/D3Evolution/demo/

## Requirements

In your page, include the `D3` and `jQuery` libraries. These can be placed anywhere:
```html
<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
```

## Installing

You can download files or load files directly using [RawGit](https://rawgit.com/).

For production usage link a specific tag or commit. For example:
```html
<script src="//cdn.rawgit.com/moisseev/D3Evolution/14673e0e85ad656313f76f0071f1dee33b521606/d3evolution.js"></script>
<link rel="stylesheet" type="text/css" href="//cdn.rawgit.com/moisseev/D3Evolution/14673e0e85ad656313f76f0071f1dee33b521606/d3evolution.css">
```
For development you can also use links to the latest version. Do not use these links in production, excessive traffic will be throttled and blacklisted by RawGit. For example:
```html
<script src="//cdn.rawgit.com/moisseev/D3Evolution/master/d3evolution.js"></script>
<link rel="stylesheet" type="text/css" href="//cdn.rawgit.com/moisseev/D3Evolution/master/d3evolution.css">
```

## API

The API functions are accessible like so:
```javascript
var evolution = new D3Evolution("id", options);
evolution.type("area");
```

**D3Evolution**(_id_[, _options_])    
is the chart constructor, which takes two parameters. The first parameter is the ID string. The second one is an _options_ hash object. 

### The options object

Default settings:
```javascript
{
    title: "",
    width: 800,
    height: 400,
    margin: {top: 80, right: 60, bottom: 40, left: 60},
    yAxisLabel: "",

    type: "line", // area|line

    duration: 1250,
    interpolate: "curveLinear",

    //  convert: "percentage",

    legend: {
        buttonRadius: 7,
        space: 130,

        entries: [
            //  ,
            //  ,
            //  {label: "Greylisted", color: "#436EEE"},
            //  {label: "Clean",      color: "#66cc00"},
        ]
    }
}
```

Options details:

Option | Type | Default | Description
---| --- | --- | ---
**title**       | `string` | empty | Title of the chart.
**width**       | `number` | 800 | Width of the chart in pixels.
**height**      | `number` | 400 | Height of the chart in pixels.
**margin**      | `hash`   | see description | Margins of the inner chart area (clockwise from the top, as in CSS). The default are `{top: 80, right: 60, bottom: 40, left: 60}`
**yAxisLabel**  | `string` | empty | Label of the Y-axis.
**type**        | `string` | line | Type of the chart, `line` or `area`.
**duration**    | `number` | 1250 | Transition effects duration in milliseconds.
**interpolate** | `string` | curveLinear | Path interpolation _mode_. See [Interpolation modes](#interpolation-modes).
**convert**     | `string` | undefined | Convert the dataset to percentage if set to `percentage` or leave it as is otherwise.
**legend**      | `hash` | see description | The `legend` hash object. The default is `{buttonRadius: 7, space: 130, entries: []}`
legend.buttonRadius | `number` | 7 | Legend buttons radius in pixels.
legend.space   | `number` | 130 | Horizontal space between legend entries in pixels.
legend.entries | `array` | [] | An array of legend entries. Each of the entries is a hash with structure `{label: "Label", color: "#436EEE"}`. `path_N` labels (where `N` is the index of the array element) and `d3.scale.category10()` color palette are used for undefined legend entries.

### Methods
Method | Default | Description
---| :---: | ---
**convert**(_type_)     | `undefined` | Convert the dataset to percentage if _type_ is `percentage` or leave it as is otherwise.
**data**(_dataset_)     | -        | Reads _dataset_. See [Reading data](#reading-data).
**destroy**()           | -        | Removes a chart instance from the page.
**interpolate**(_mode_) | `curveLinear` | Path interpolation _mode_. See [Interpolation modes](#interpolation-modes).
**legend**(_legend_)    | -        | Updates the chart legend using a `legend` hash object as an argument.
**type**(_type_)        | `line`   | Chart _type_, `area` or `line`.
**yAxisLabel**(_label_) | empty    | Updates the Y-axis label.

### Interpolation modes
Mode|
---|
`curveLinear`|
`curveStep`|
`curveStepBefore`|
`curveStepAfter`|
`curveMonotoneX`|
`curveBasis`|
`curveBasisOpen`|
`curveBundle`|
`curveCardinal`|
`curveCardinalOpen`|
`curveCatmullRom`|
`curveCatmullRomOpen`|
`curveNatural`|

For modes description refer to the [Curves](https://github.com/d3/d3-shape#curves) section of `d3-shape` documentation.

## Reading data

JSON dataset format:
```javascript
[
    [{"x":1471765200,"y":null},{"x":1471851360,"y":0.041450}, ... {"x":1471851240,"y":0.0}],
    [{"x":1471765200,"y":null},{"x":1471851360,"y":0.016583}, ... {"x":1471851240,"y":0.0}],
...
    [{"x":1471765200,"y":null},{"x":1471851360,"y":0.053435}, ... {"x":1471851240,"y":0.0}]
]
```
where "x": Epoch time (seconds), "y": Y-value or `null` if undefined.
Each array is represented as a line on the chart.

Loading dataset with d3.json:
```javascript
function getJSON(uri) {
    d3.json(uri, function(error, json) {
        if (error) return console.warn("d3.json error: " + error);
        evolution.data(json);
    });
}
```
