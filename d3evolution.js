function D3Evolution(id, options) {
    "use strict";

    var opts = $.extend(true, {
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
    }, options);

    var data;
    var srcData;
    var legendX;

    var width = opts.width - opts.margin.left - opts.margin.right;
    var height = opts.height - opts.margin.top - opts.margin.bottom;

    var xScale = d3.time.scale().range([0, width]);
    var yScale = d3.scale.linear().range([height, 0]);
    var xAxis = d3.svg.axis().scale(xScale);
    var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(5);

    var xAxisGrid = d3.svg.axis().tickFormat("").scale(xScale)
        .tickSize(-height, 0);
    var yAxisGrid = d3.svg.axis().tickFormat("").scale(yScale).orient("left")
        .tickSize(-width, 0);

    var yScaleBoolean = d3.scale.quantize().range([height, 0]);
    var areaNull = d3.svg.area()
        .x(function (d) { return xScale(d.x); })
        .y0(function (d) { return height; })
        .y1(function (d) { return yScaleBoolean(d.y == null); })
        .interpolate("step");

    var line = d3.svg.line()
        .defined(function(d) { return d.y != null; })
        .x(function (d) { return xScale(d.x); })
        .y(function (d) { return yScale(d.y); })
        .interpolate(opts.interpolate);

    var area = d3.svg.area()
        .defined(function(d) { return d.y != null; })
        .x(function (d) { return xScale(d.x); })
        .y0(function (d) { return yScale(d.y0); })
        .y1(function (d) { return yScale(d.y0 + d.y); })
        .interpolate(opts.interpolate);

    var stack = function () {
        var yExtents;

        if (opts.type === "area") {
            d3.layout.stack()(data);
            yExtents = d3.extent(d3.merge(data), function (d) { return d.y0 + d.y; });
        } else {
            yExtents = d3.extent(d3.merge(data), function (d) { return d.y; });
        }

        yScale.domain([(yExtents[0] > 0) ? 0 : yExtents[0], yExtents[1]]);

        d3.transition().duration(opts.duration).each(function () {
            g.select(".y.grid").call(yAxisGrid.scale(yScale));
            g.select(".y.axis").call(yAxis.scale(yScale));
        });
    }

    var colorScale = d3.scale.category10();

    var pathColor = function (i) {
        return (opts.legend.entries[i] !== undefined &&
                opts.legend.entries[i].color !== undefined) ?
            opts.legend.entries[i].color :
            colorScale(i);
    };

    var pathLabel = function (i) {
        return (opts.legend.entries[i] !== undefined &&
                opts.legend.entries[i].label !== undefined) ?
            opts.legend.entries[i].label :
            "path_" + i;
    };

    var convert2Percentage = function (a) {
        var total = a.reduce(function (res, curr) {
            return curr.map(function (d, i) { return d.y + (res[i] ? res[i] : 0); });
        }, []);

        var dataPercentage = $.extend(true, [], a);

        dataPercentage.forEach(function (s) {
            s.forEach(function (d, i) { if (total[i]) {d.y /= total[i];} });
        });

        return dataPercentage;
    }

    var yPreprocess = function () {
        if (opts.convert === "percentage") {
            yAxis.tickFormat(d3.format(".0%"));
            yAxisLabel.transition().duration(opts.duration).style("opacity", 0);
            data = convert2Percentage(srcData);
        } else {
            yAxis.tickFormat(null);
            yAxisLabel.transition().duration(opts.duration).style("opacity", 1);
            data = srcData;
        }
        stack();
    }

    var svg = d3.select("#" + id).append("svg")
        .classed('d3evolution', true)
        .attr("width", opts.width)
        .attr("height", opts.height);

    var legend = svg.append("g").attr("class", "legend");

    var g = svg.append("g")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + opts.margin.left + ", " + opts.margin.top + ")");

    g.append("g")
        .attr("class", "x grid")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxisGrid);

    g.append("g")
        .attr("class", "y grid")
        .attr("transform", "translate(0,0)")
        .call(yAxisGrid);

    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    g.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0,0)")
        .call(yAxis);

    var yAxisLabel = g.append("text")
        .attr("class", "y label")
        .attr("x", 20 - opts.margin.left)
        .attr("y", -20)
        .text(opts.yAxisLabel);

    svg.append("svg:text")
        .attr("class", "chart-title")
        .attr("x", (opts.width / 2))
        .attr("y", (opts.margin.top / 3))
        .attr("text-anchor", "middle")
        .text(opts.title);

    this.data = function (a) {
        srcData = a;

        var opacity = [];

        legendX = opts.width - opts.margin.right - opts.legend.space * srcData.length;

        // Convert time in seconds to milliseconds
        srcData.forEach(function (s) {
            s.forEach(function (d) { d.x *= 1000; });
        });

        var xExtents = d3.extent(d3.merge(srcData), function (d) { return d.x; });
        xScale.domain([xExtents[0], xExtents[1]]);

        var pathNull = g.selectAll("path.path-null").data(srcData);

        pathNull.enter()
            .append("path")
            .attr("class", "path-null");

        pathNull
            .transition().duration(opts.duration / 2)
            .style("opacity", 0)
            .each("end", function () {
                pathNull
                    .attr("d", areaNull)
                    .transition().duration(opts.duration / 2)
                    .style("opacity", 1);
            });

        pathNull.exit()
            .remove();

        yPreprocess();

        var path = g.selectAll("path.path").data(data);

        path.enter()
            .append("path")
            .attr("class", "path")
            .attr("id", function (d, i) { return "path_" + i; })
            .on("click",     function (d, i) { onClick(i); })
            .on("mouseover", function (d, i) { onMouseover(i); })
            .on("mouseout",  function (d, i) { onMouseout(i); })
            .style((opts.type === "area") ? {
                fill:   function (d, i) { return pathColor(i); },
                stroke: "none",
                "fill-opacity": function (d, i) { return opacity[i]; }
            } : {
                fill:   "none",
                stroke:  function (d, i) { return pathColor(i); },
                opacity: function (d, i) { return opacity[i]; }
            });

        path.transition().duration(opts.duration).attr("d", (opts.type === "area") ? area : line);

        path.exit()
            .remove();

        d3.transition().duration(opts.duration).each(function () {
            g.select(".x.grid").call(xAxisGrid.scale(xScale));
            g.select(".x.axis").call(xAxis.scale(xScale));
        });

        var onClick = function (i) {
            opacity[i] = (opacity[i] != 0) ? 0 : 1;

            d3.select("#circle_" + i)
                .transition().duration(opts.duration)
                .style("fill-opacity", opacity[i] + 0.2);

            d3.select("#path_" + i)
                .transition().duration(opts.duration)
                .style("opacity", opacity[i]);
        };

        var onMouseover = function (a) {
            d3.select("#circle_" + a)
                .attr("r", opts.legend.buttonRadius * 1.3);

            path
                .style("opacity",      function (d, i) { return i === a ? 1 : opacity[i] == 0 ? 0 : 0.4; })
                .style("fill-opacity", function (d, i) { return i === a ? 1 : opacity[i] == 0 ? 0 : 0.4; });
        };

        var onMouseout = function (a) {
            d3.select("#circle_" + a)
                .attr("r", opts.legend.buttonRadius);

            path
                .style("opacity",      function (d, i) { return opacity[i]; })
                .style("fill-opacity", function (d, i) { return opacity[i]; });
        };

        var buttons = legend.selectAll("circle").data(data);

        buttons.enter().append("circle")
            .attr("id", function (d, i) { return "circle_" + i; })
            .attr("cy", opts.margin.top * 2 / 3)
            .attr("r", opts.legend.buttonRadius)
            .style("fill",   function (d, i) { return pathColor(i); })
            .style("stroke", function (d, i) { return pathColor(i); })
            .style("fill-opacity", function (d, i) { return opacity[i] + 0.2; })
            .on("click",     function (d, i) { onClick(i); })
            .on("mouseover", function (d, i) { onMouseover(i); })
            .on("mouseout",  function (d, i) { onMouseout(i); });

        buttons.exit()
            .remove();

        buttons.transition().duration(opts.duration)
            .attr("cx", function (d, i) { return legendX + opts.legend.space * i; });

        var labels = legend.selectAll("text").data(data);

        labels.enter()
            .append("text")
            .attr("y", opts.margin.top * 2 / 3)
            .attr("dy", "0.3em")
            .text(function (d, i) { return pathLabel(i); })
            .on("click",     function (d, i) { onClick(i); })
            .on("mouseover", function (d, i) { onMouseover(i); })
            .on("mouseout",  function (d, i) { onMouseout(i); });

        labels.exit()
            .remove();

        labels.transition().duration(opts.duration)
            .attr("x", function (d, i) {
                return legendX + opts.legend.space * i + 2 * opts.legend.buttonRadius;
            });

        return this;
    };

    this.legend = function (a) {
        $.extend(true, opts.legend, a);

        legend.selectAll("circle")
            .transition().duration(opts.duration)
            .attr("cx", function (d, i) { return legendX + opts.legend.space * i; })
            .attr("r", opts.legend.buttonRadius)
            .style("fill",   function (d, i) { return pathColor(i); })
            .style("stroke", function (d, i) { return pathColor(i); });

        legend.selectAll("text")
            .text(function (d, i) { return pathLabel(i); })
            .transition().duration(opts.duration)
            .attr("x", function (d, i) {
                return legendX + opts.legend.space * i + 2 * opts.legend.buttonRadius;
            });

        g.selectAll("path.path")
            .transition().duration(opts.duration)
            .style("fill",   (opts.type === "area") ? function (d, i) { return pathColor(i); } : "none")
            .style("stroke", (opts.type !== "area") ? function (d, i) { return pathColor(i); } : "none");

        return this;
    };

    this.convert = function (a) {
        opts.convert = a;

        yPreprocess();

        g.selectAll("path.path")
            .data(data)
            .transition().duration(opts.duration)
            .attr("d", (opts.type === "area") ? area : line);

        return this;
    };

    this.interpolate = function (a) {
        opts.interpolate = a;

        area.interpolate(opts.interpolate);
        line.interpolate(opts.interpolate);

        g.selectAll("path.path")
            .attr("d", (opts.type === "area") ? area : line);

        return this;
    };

    this.type = function (a) {
        opts.type = a;

        stack();

        g.selectAll("path.path")
            .style("stroke", (opts.type !== "area") ? function (d, i) { return pathColor(i); } : "none")
            .style("fill",   (opts.type === "area") ? function (d, i) { return pathColor(i); } : "none")
            .transition().duration(opts.duration)
            .attr("d", (opts.type === "area") ? area : line);

        return this;
    };

    this.destroy = function () {
        d3.select("svg").remove();
    };
}
