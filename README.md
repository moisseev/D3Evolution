# D3Evolution
Simple reusable evolution d3 chart

Live demo is available at http://moisseev.github.io/D3Evolution/demo/

## Requirements

In your page, include the `D3` and `jQuery` libraries. These can be placed anywhere:
```html
<script src="http://d3js.org/d3.v3.min.js"></script>
<script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
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
    interpolate: "linear",

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

### Methods
Method | Default | Description
---| :---: | ---
**convert**(_type_)     | `undefined` | Convert the dataset to percentage if _type_ is `percentage` or leave it as is otherwise.
**data**(_dataset_)     | -        | Reads _dataset_. See [Reading data](#reading-data).
**destroy**()           | -        | Removes a chart instance from the page.
**interpolate**(_mode_) | `linear` | Path interpolation _mode_. For the full list of available modes refer to the `line.interpolate` section of D3 documentation.
**legend**( ??? )       |          | The `legend` hash object.
**type**(_type_)        | `line`   | Chart _type_, `area` or `line`.

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
