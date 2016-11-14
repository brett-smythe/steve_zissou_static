// Importing d3 directly didn't seem to go over well so individual imports are in order
import { scaleLinear, scaleTime, scaleOrdinal, schemeCategory20, } from 'd3-scale';
import { axisBottom, axisLeft, } from 'd3-axis';
import { line, } from 'd3-shape';
import { select, } from 'd3-selection';
import { utcParse, } from 'd3-time-format';
import { extent, } from 'd3-array';

class UserSearchTermGraph {

  constructor() {
    this.usernameColors = {};
    // FIXME: Figure out how to dynamically size this
    this.margins = { top: 100, right: 20, bottom: 30, left: 100, };
    this.width = 960 - this.margins.left - this.margins.right;
    this.height = 500 - this.margins.top - this.margins.bottom;
    this.xScale = scaleTime().range([0, this.width,]);
    this.yScale = scaleLinear().range([this.height, 0,]);
    this.xAxis = axisBottom(this.xScale);
    this.yAxis = axisLeft(this.yScale);
    this.line = line()
      .x(datum => this.xScale(this.formatDate(datum[0])))
      .y(datum => this.yScale(datum[1]));
    this.svg = select('#twitter-search-graph')
      .append('svg')
        .attr('width', this.width + this.margins.left + this.margins.right)
        .attr('height', this.height + this.margins.top + this.margins.bottom)
        .attr('id', 'graphed-data')
      .append('g')
        .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`);
    this.scaleColors = scaleOrdinal(schemeCategory20);
    this.searchterm = '';
  }

  addUserNameForKey(username) {
    //FIXME: Unexpected behavior after 20 twitter users are selected for graphing
    const colorIndex = Object.keys(this.usernameColors).length + 1;
    this.usernameColors[username] = this.scaleColors(colorIndex);
  }

  formatDate(dateString) {
    return utcParse('%Y-%m-%d')(dateString);
  }

  graphSearchData(searchTerm, dateRange, searchTermCounts, parsedSearchData) {
    this.searchTerm = searchTerm;
    const convertedDateRanges = dateRange.map(this.formatDate);
    this.xScale.domain(extent(convertedDateRanges));
    this.yScale.domain(extent(searchTermCounts));
    this.svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${this.height})`)
        .call(this.xAxis);
    this.svg.append('g')
        .attr('class', 'y axis')
        .call(this.yAxis);
    this.svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.75em')
        .style('text-anchor', 'end')
        .text(`"${this.searchTerm}" mentions`);
    Object.keys(parsedSearchData).forEach(twitterUsername => {
      this.addUserNameForKey(twitterUsername);
      Object.keys(parsedSearchData[twitterUsername]).forEach(searchTerm => {
        const dateCounts = parsedSearchData[twitterUsername][searchTerm];
        this.svg.append('path')
          .datum(dateCounts)
          .attr('class', 'line')
          .attr('d', this.line)
          .attr('stroke', this.usernameColors[twitterUsername]);
      });
    });
    this.addGraphKey();
  }

  addGraphKey() {
    const parentDiv = document.getElementById('graph-key-container');
    const graphDefList = document.createElement('dl');
    graphDefList.id = 'graph-key';
    Object.keys(this.usernameColors).forEach(username => {
      const defElement = document.createElement('dt');
      const keyColorDiv = document.createElement('div');
      keyColorDiv.className = 'key-color-box';
      // This failed to style by setting .background or .backgroundColor, so here we are:
      keyColorDiv.style = `background: ${this.usernameColors[username]}`;
      const descElement = document.createElement('dd');
      const descElementText = document.createTextNode(` - ${username} `);
      descElement.appendChild(descElementText);
      defElement.appendChild(keyColorDiv);
      defElement.appendChild(descElement);
      graphDefList.appendChild(defElement);
    });
    parentDiv.appendChild(graphDefList);
  }
}

export default UserSearchTermGraph;

