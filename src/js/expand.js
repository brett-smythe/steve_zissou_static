var selectedTwitterUsers = new Set();
var selectedDateRange = [];
var searchTerm = "";
var startMoment;
var endMoment;
var momentRange = [];
var colorRange = d3.scale.category20();
var usernameColors = {};

$(".twitterSelectHeader").click(function () {
    $twitterHeader = $(this);
    //Getting the next element
    $twitterContent = $twitterHeader.next();
    //Open up the content needed - toggle the slide- if visible, slide up, if not slide down.
    $twitterContent.slideToggle(500, function() {
        //execute this after the slideToggle is done
        //change the text of the header based on the visibility of the content div
        $twitterHeader.text(function () {
            //change text based on condition
            return $twitterContent.is(":visible") ? "Select Users" : "Select Users";
        });
    });
});

$(".dateSelectHeader").click(function () {
    $("input:checkbox[name=twitterCheckbox]:checked").each(function(){
        console.log("Adding user " + $(this).val());
        selectedTwitterUsers.add($(this).val());
    });
    console.log(selectedTwitterUsers);
    $header = $(this);
    $content = $header.next();
    $content.slideToggle(500, function() {
        $header.text(function () {
            return $content.is(":visible") ? "Select Date" : "Select Date";
        });
    });
});


$(".searchSelectHeader").click(function () {
    var startDate = document.getElementById("startDate").value;
    var endDate = document.getElementById("endDate").value;
    selectedDateRange = [startDate, endDate];
    startMoment = moment(startDate);
    endMoment = moment(endDate);
    console.log(selectedDateRange);
    console.log(startMoment.toISOString());
    console.log(endMoment.toISOString());
    $header = $(this);
    $content = $header.next();
    $content.slideToggle(500, function() {
        $header.text(function () {
            return $content.is(":visible") ? "Search Term" : "Search Term";
        });
    });
});

var request = $.ajax({
        url: "eleanor/twitter-users",
        type: "GET",
        dataType: "json"
    });

request.done(function(msg) {
    // $("#log").html( msg );
    console.log(msg);
    var msgLength = msg.length;
    console.log(msgLength);
    for (var i = 0; i < msgLength; i++) {
      //$(".twitter-users").append("<li><a href=\"\">" + msg[i] + "</a></li>");
      //$(".twitter-users").append("<li>" + msg[i] + "</li>");
      $(".twitter-users").append("<li><label><input type=\"checkbox\" name=\"twitterCheckbox\" value=\"" + msg[i] + "\">" + msg[i] + "</label></li>");
    }
});

request.fail(function(jqXHR, textStatus) {
    alert( "Request failed: " + textStatus);
});

var searchDateRanges = new Set();
var searchTermCounts = [0];
var collectedSearchData = {};

//collectedSearchData = {
//    "username" : {
//        "search_string": [
//            ["2016-08-20", 10],
//            ["2016-08-15", 0],
//            ...
//        ],
//        "search_string_2": [
//            ...
//        ]
//    },
//    "second_username": {
//        ...
//    },
//    ...
//}
var formatDate = d3.time.format("%Y-%m-%d");

function addTwitterSearchData(username, date, searchTerm, termCount) {
    if (!collectedSearchData.hasOwnProperty(username)){
        collectedSearchData[username] = {};
    }
    if (!collectedSearchData[username].hasOwnProperty(searchTerm)) {
        collectedSearchData[username][searchTerm] = [];
    }
    var newSearchData = [date, termCount];
    collectedSearchData[username][searchTerm].push(newSearchData);
};

function parseEleanorData(searchStringData) {
    var searchData = JSON.parse(searchStringData);
    console.log("In parseEleanorData");
    console.log(searchStringData);
    var twitterUserName = Object.keys(searchData)[0];
    console.log("Twitter User Name: " + twitterUserName);
    var searchTerm;
    var searchTermCount;
    var searchDate;
    Object.keys(searchData[twitterUserName]).forEach(function(k) {
        if (k === "date") {
            var eleanorDate = searchData[twitterUserName]["date"];
            console.log("Pre parsed date from eleanor: " +  eleanorDate);
            searchDate = formatDate.parse(searchData[twitterUserName]["date"]);
        } else {
            searchTerm = k;
        }
    });
    searchTermCount = searchData[twitterUserName][searchTerm];
    searchTermCounts.push(searchTermCount);
    console.log("Search term: " + searchTerm);
    console.log("Search term count: " + searchTermCount);
    addTwitterSearchData(twitterUserName, searchDate, searchTerm, searchTermCount);
};

//var searchDate = formatDate.parse(searchData[twitterUserName]["date"]);
//searchDateObjs.push(searchDate);

function getSearchDateRange() {
    // Avoiding the reference modifying the original
    var newMoment = moment(startMoment.toISOString());
    if ((startMoment != undefined) && (endMoment != undefined)) {
        while (newMoment.isSameOrBefore(endMoment)) {
            var formattedMoment = newMoment.format("YYYY-MM-DD");
            momentRange.push(formattedMoment);
            var searchDate = formatDate.parse(formattedMoment);
            searchDateRanges.add(searchDate);
            newMoment.add(1, 'd');
        }
    }
};

var testReq = new XMLHttpRequest();

testReq.onload = function(e) {
    console.log("Response from eleanor");
    //console.log(testReq.responseText);
    parseEleanorData(testReq.responseText);
    //parseSearchDateRange(restReq.responseText);
    makeTwitterSearchReq();
};

var currentTwitterSearchUser;

function makeTwitterSearchReq() {
    if (selectedTwitterUsers.size >= 1 || momentRange.length != 0) {
        if (momentRange.length == 0) {
            currentTwitterSearchUser = selectedTwitterUsers.keys().next().value;
            setUserGraphColor(currentTwitterSearchUser);
            selectedTwitterUsers.delete(currentTwitterSearchUser);
            console.log(currentTwitterSearchUser);
            console.log(startMoment.toISOString());
            getSearchDateRange();
            console.log("Calculating dates");
        };
        var searchParams = {}
        var searchDate = momentRange.shift();
        console.log(searchDate);
        searchParams["twitter_username"] = currentTwitterSearchUser;
        searchParams["search_date"] = searchDate;
        searchParams["search_term"] = searchTerm;
        console.log("Submitting search");
        testReq.open("POST", "eleanor/tweets-on-date", true);
        testReq.setRequestHeader('content-type', 'application/json');
        testReq.send(JSON.stringify(searchParams));
    } else {
        graphSearchData();
    };
};

function submitSearch() {
    searchTerm = document.getElementById("searchTerm").value;
    console.log(selectedTwitterUsers);
    console.log(selectedDateRange);
    console.log(searchTerm);
    makeTwitterSearchReq();
};

function handleSearch(msg) {
    console.log(msg);
};

var margin = {top: 100, right: 20, bottom: 30, left: 100},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


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
    .x(function(d) { 
        var xVal = d[0];
        var xConverted = x(xVal);
        console.log("xVal is: " + xVal);
        console.log("xConverted is: " + xConverted);
        //return x(d[1]); 
        return xConverted;
        })
    .y(function(d) {
        var yVal = d[1];
        var yConverted = y(yVal);
        console.log("yVal is: " + yVal);
        console.log("yConverted is: " + yConverted);
        //return y(d[0]);
        return yConverted;
        });

var svg = d3.select(".testGraph").append("svg")
//var svg = d3.select("div").attr("class", "row placeholders").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function setUserGraphColor(username) {
    var colorIndex = Object.keys(usernameColors).length + 1;
    usernameColors[username] = colorRange(colorIndex);

};

function graphSearchData() {
    console.log("In graphSearchData");

    var arrayOfDateRanges = Array.from(searchDateRanges);
    console.log("Extent of date ranges: " + arrayOfDateRanges);
    x.domain(d3.extent(arrayOfDateRanges));
    y.domain(d3.extent(searchTermCounts));

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
    

//    var graphData = [searchDate, searchTermCount];
//    svg.append("path")
//        .datum(graphData)
//        .attr("class", "line")
//        .attr("d", line);

//collectedSearchData = {
//    "username" : {
//        "search_string": [
//            ["2016-08-20", 10],
//            ["2016-08-15", 0],
//            ...
//        ],
//        "search_string_2": [
//            ...
//        ]
//    },
//    "second_username": {
//        ...
//    },
//    ...
//}

    console.log("Building graph data");
    Object.keys(collectedSearchData).forEach(function(k) {
        var twitterUsername = k;
        console.log("Current twitter username: " + twitterUsername);
            Object.keys(collectedSearchData[twitterUsername]).forEach(function(l) {
                var searchString = l;
                console.log("Current search string is: " + searchString);
                var datesCounts = collectedSearchData[twitterUsername][searchString];
                console.log("Date counts array is: " + datesCounts);
                 svg.append("path")
                    .datum(datesCounts)
                    .attr("class", "line")
                    .attr("d", line)
                    .attr("stroke", usernameColors[twitterUsername]);
            });
    });
    buildGraphKey();
};

function buildGraphKey() {
    var graphDefList = document.createElement("dl");
    graphDefList.className = "graphKey";
    var keyHTML = "";
    Object.keys(usernameColors).forEach(function(k) {
        var twitterUsername = k;
        var usernameColor = usernameColors[twitterUsername];
        keyHTML += "<dt> <div class=\"keyColorBox\" style=\"background: " + usernameColor + "\"></div></dt> ";
        keyHTML += "<dd> - " + twitterUsername + " </dd>";
    });
    graphDefList.innerHTML = keyHTML;
    document.getElementsByClassName("graphKeyContainer")[0].appendChild(graphDefList);
};
