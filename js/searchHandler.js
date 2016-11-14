import { searchSelectEvent, } from './graphingEvents';

class TwitterSearchHandler {

  constructor() {
    this.addSearchSelectClickHandler();
    this.addSearchFieldUpdateHandler();
  }

  addSearchFieldUpdateHandler() {
    const searchBox = document.getElementById('search-term');
    searchBox.onkeyup = this.fireUpdatedDateSelectEvent;
  }

  fireUpdatedDateSelectEvent() {
    const searchButton = document.getElementById('graph-search-button');
    searchButton.dispatchEvent(searchSelectEvent);
  }

  addSearchSelectClickHandler() {
    const searchTermSelectDiv = document.getElementById('twitter-select-term-container');
    const searchTermDiv = document.getElementById('twitter-select-string');
    searchTermSelectDiv.addEventListener('click', event => { //eslint-disable-line no-unused-vars
      searchTermDiv.style.display = searchTermDiv.style.display === 'none' ? '' : 'none';
    }, false);
  }

  getSearchTerm() {
    const searchBox = document.getElementById('search-term');
    return searchBox.value;
  }
}

export default TwitterSearchHandler;

