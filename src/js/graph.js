var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatDate = d3.time.format("%Y-%m-%d");


var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d[0]); })
    .y(function(d) { return y(d[1]); });

var svg = d3.select("div").attr("class", "testGraph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var searchTermCounts = [0];
var searchDateObjs = [];

function graphSearchData(searchData) {
    var twitterUserName = Object.keys(searchData)[0];
    var searchTerm;
    var searchTermCount;
    var searchDate = formatDate.parse(searchData[twitterUserName]["date"]);

    searchDateObjs.push(searchDate);
    Object.keys(searchData[twitterUserName]).forEach(function(k) {
        if (k !== "date") {
            searchTerm = k;
        }
    });
    searchTermCount = searchData[twitterUserName][searchTerm];
    searchTermCounts.push(searchTermCount);

    x.domain(d3.extent(searchDateObjs));
    y.domain(d3.extent(searchTermCounts));

    var graphData = [searchDate, searchTermCount];

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Daily Usage(s)");

    svg.append("path")
        .datum(graphData)
        .attr("class", "line")
        .attr("d", line);
};
