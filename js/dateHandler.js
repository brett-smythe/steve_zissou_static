import Pikaday from 'pikaday';
import { searchSelectEvent, } from './graphingEvents';

class TwitterDateHandler {

  constructor() {
    this.startDatePicker = new Pikaday({
      field: document.getElementById('start-date'),
      onSelect: this.fireUpdatedDateSelectEvent,
    });
    this.endDatePicker = new Pikaday({
      field: document.getElementById('end-date'),
      onSelect: this.fireUpdatedDateSelectEvent,
    });
    this.addDateSelectClickHandler();
  }

  fireUpdatedDateSelectEvent() {
    const searchButton = document.getElementById('graph-search-button');
    searchButton.dispatchEvent(searchSelectEvent);
  }

  addDateSelectClickHandler() {
    const dateSelectDiv = document.getElementById('twitter-select-date-container');
    const datePickerDiv = document.getElementById('twitter-select-date');
    dateSelectDiv.addEventListener('click', event => { //eslint-disable-line no-unused-vars
      datePickerDiv.style.display = datePickerDiv.style.display === 'none' ? '' : 'none';
    }, false);
  }

  getStartDate() {
    const startDate = document.getElementById('start-date').value;
    return startDate;
  }

  getEndDate() {
    const endDate = document.getElementById('end-date').value;
    return endDate;
  }

}

export default TwitterDateHandler;

