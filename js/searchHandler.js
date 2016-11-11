class TwitterSearchHandler {

  constructor() {
    this.addSearchSelectClickHandler();
  }

  addSearchSelectClickHandler() {
    const searchTermSelectDiv = document.getElementById('twitter-select-term-container');
    const searchTermDiv = document.getElementById('twitter-select-string');
    searchTermSelectDiv.addEventListener('click', event => { //eslint-disable-line no-unused-vars
      searchTermDiv.style.display = searchTermDiv.style.display === 'none' ? '' : 'none';
    }, false);
  }

  getSearchTerm() {
    const searchBox = document.getElementById('searchTerm');
    return searchBox.value;
  }
}

export default TwitterSearchHandler;

