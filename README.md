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

Loading dataset with d3.json:
```javascript
function getJSON(uri) {
    d3.json(uri, function(error, json) {
        if (error) return console.warn("d3.json error: " + error);
        evolution.data(json);
    });
}
```
