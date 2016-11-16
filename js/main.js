import moment from 'moment';
import TwitterUserHandler from './userHandler';
import TwitterDateHandler from './dateHandler';
import TwitterSearchHandler from './searchHandler';
import UserSearchTermGraph from './searchGrapher';
import logger from './logger';
import { searchSelectEventString, } from './graphingEvents';

class TwitterUserDateTermSearch {

  constructor() {
    this.twitterUserHandler = new TwitterUserHandler();
    this.twitterDateHandler = new TwitterDateHandler();
    this.twitterSearchHandler = new TwitterSearchHandler();
    this.searchTermGraph = new UserSearchTermGraph();
    this.selectedTwitterUsers = [];
    this.selectedStartDate = '';
    this.selectedEndDate = '';
    this.selectedSearchTerm = '';
    this.searchDateRange = [];
    this.searchInProgress = false;
    this.parsedResponseData = {};
    this.searchTermCounts = [];
    this.addSearchButtonClickHandler();
    this.addSearchButtonSearchUpdateEventHandler();
    this.addSearchButtonMouseEnterHandler();
    this.addSearchButtonMouseLeaveHandler();
    this.userIdx = 0;
    this.graphDateRange = [];
  }

  addSearchButtonSearchUpdateEventHandler() {
    const searchButton = document.getElementById('graph-search-button');
    const cls = this;
    const updateSearchButtonState = function() {
      logger('Update search button state');
      cls.updateSearchValues();
      const searchButton = document.getElementById('graph-search-button');
      if (cls.searchValuesValid()) {
        logger('Changing button styles');
        searchButton.setAttribute(
          'style',
          'background-color: #A5BFCB;color: black;box-shadow: 2px 2px 1px;'
        );
      } else {
        logger('Changing button styles, invalid');
        searchButton.setAttribute(
          'style',
          'background-color: #D6E3E9;color: 9D9D9D;box-shadow: 0px 0px 0px;'
        );
      }
    };
    searchButton.addEventListener(searchSelectEventString, updateSearchButtonState, false);
  }

  addSearchButtonMouseEnterHandler() {
    const searchButton = document.getElementById('graph-search-button');
    const cls = this;
    const mouseEnterChangeButton = function() {
      if (cls.searchValuesValid()) {
        const searchButton = document.getElementById('graph-search-button');
        searchButton.setAttribute(
          'style',
          'background-color: #4B788B;color: black;box-shadow: 2px 2px 1px;'
        );
      }
    };
    searchButton.addEventListener('mouseenter', mouseEnterChangeButton, false);
  }

  addSearchButtonMouseLeaveHandler() {
    const searchButton = document.getElementById('graph-search-button');
    const cls = this;
    const mouseLeaveChangeButton = function() {
      const searchButton = document.getElementById('graph-search-button');
      if (cls.searchValuesValid()) {
        searchButton.setAttribute(
          'style',
          'background-color: #A5BFCB;color: black;box-shadow: 2px 2px 1px;'
        );
      } else {
        searchButton.setAttribute(
          'style',
          'background-color: #D6E3E9;color: 9D9D9D;box-shadow: 0px 0px 0px;'
        );
      }
    };
    searchButton.addEventListener('mouseleave', mouseLeaveChangeButton, false);
  }

  updateSearchValues() {
    this.selectedTwitterUsers = this.twitterUserHandler.getSelectedTwitterUsers();
    this.selectedStartDate = this.twitterDateHandler.getStartDate();
    this.selectedEndDate = this.twitterDateHandler.getEndDate();
    this.selectedSearchTerm = this.twitterSearchHandler.getSearchTerm();
  }

  addSearchButtonClickHandler() {
    const searchButton = document.getElementById('graph-search-button');
    searchButton.addEventListener('click', () => {
      if (this.searchInProgress) {
        logger('Search in progress, ignoring button click for new search');
        return;
      }
      this.updateSearchValues();
      this.parsedResponseData = {};
      this.searchTermCounts = [];
      this.searchDateRange = [];
      this.searchTermGraph.clearGraph();
      this.startSearch();
    });
  }

  searchValuesValid() {
    if (this.selectedTwitterUsers.length <= 0) {
      logger('No twitter users were selected for query');
      return false;
    } else if (this.selectedStartDate === '' || this.selectedStartDate === 'Start Date') {
      logger('No start date value was selected');
      return false;
    } else if (this.selectedEndDate === '' || this.selectedEndDate === 'End Date') {
      logger('No end date value was selected');
      return false;
    } else if (!moment(this.selectedStartDate).isValid()) {
      logger('Invalid start date value was given');
      return false;
    } else if (!moment(this.selectedEndDate).isValid()) {
      logger('Invalid end date value was given');
      return false;
    } else if (!moment(this.selectedStartDate).isBefore(this.selectedEndDate)) {
      logger('Start date given is after given end date');
      return false;
    } else if (this.selectedSearchTerm === '') {
      logger('No search term was provided');
      return false;
    }
    return true;
  }

  createDateSearchRange() {
    let newMoment = moment(this.selectedStartDate); // eslint-disable-line prefer-const
    while (newMoment.isSameOrBefore(this.selectedEndDate)) {
      this.searchDateRange.push(newMoment.format('YYYY-MM-DD'));
      this.graphDateRange.push(newMoment.format('YYYY-MM-DD'));
      newMoment.add(1, 'd');
    }
  }

  startSearch() {
    this.searchInProgress = true;
    if (this.searchValuesValid()) {
      this.makeSearchRequest();
    } else {
      logger('All search values are not valid, aborting query request');
    }
  }

  parseResponseData(responsePayload) {
    const responseData = JSON.parse(responsePayload);
    const twitterUserName = Object.keys(responseData)[0];
    let searchTerm;
    let searchDate;
    Object.keys(responseData[twitterUserName]).forEach(key => {
      if (key === 'date') {
        searchDate = responseData[twitterUserName][key];
      } else {
        searchTerm = key;
      }
    });
    const searchTermCount = responseData[twitterUserName][searchTerm];
    this.searchTermCounts.push(searchTermCount);
    if (!this.parsedResponseData.hasOwnProperty(twitterUserName)) {
      this.parsedResponseData[twitterUserName] = {};
    }
    if (!this.parsedResponseData[twitterUserName].hasOwnProperty(searchTerm)) {
      this.parsedResponseData[twitterUserName][searchTerm] = [];
    }
    this.parsedResponseData[twitterUserName][searchTerm].push([searchDate, searchTermCount,]);
  }

  updateGraph() {
    this.searchTermGraph.graphSearchData(
        this.selectedSearchTerm,
        this.graphDateRange,
        this.searchTermCounts,
        this.parsedResponseData
    );
  }

  makeSearchRequest() {
    /*
    if (this.selectedTwitterUsers.length !== 0 || this.searchDateRange.length !== 0) {
    */
    const userIdxNotAtEnd = this.selectedTwitterUsers.length > this.userIdx;
    logger(`userIdxNotAtEnd: ${userIdxNotAtEnd}`);
    if (userIdxNotAtEnd || this.searchDateRange.length !== 0) {
      if (this.searchDateRange.length === 0) {
        this.currentTwitterSearchUser = this.selectedTwitterUsers[this.userIdx];
        logger(`current twitter search user: ${this.currentTwitterSearchUser}`);
        this.userIdx += 1;
        this.createDateSearchRange();
      }
      const searchParameters = {
        twitter_username: this.currentTwitterSearchUser, // eslint-disable-line camelcase
        search_date: this.searchDateRange.shift(), // eslint-disable-line camelcase
        search_term: this.selectedSearchTerm, // eslint-disable-line camelcase
      };
      const searchDataRequest =  new XMLHttpRequest();
      searchDataRequest.open('POST', 'eleanor/tweets-on-date', true);
      searchDataRequest.setRequestHeader('content-type', 'application/json');
      searchDataRequest.onload = () => {
        this.parseResponseData(searchDataRequest.responseText);
        this.makeSearchRequest();
        this.updateGraph();
      };
      searchDataRequest.send(JSON.stringify(searchParameters));
    } else {
      this.userIdx = 0;
      this.searchInProgress = false;
      this.createDateSearchRange();
      this.searchTermGraph.graphSearchData(
          this.selectedSearchTerm,
          this.graphDateRange,
          this.searchTermCounts,
          this.parsedResponseData
      );
    }
  }
}

const twitterUserDateTermSearch = new TwitterUserDateTermSearch(); // eslint-disable-line no-unused-vars, max-len

