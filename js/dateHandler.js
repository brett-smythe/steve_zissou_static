import Pikaday from 'pikaday';

class TwitterDateHandler {

  constructor() {
    this.startDatePicker = new Pikaday({ field: document.getElementById('startDate'), });
    this.endDatePicker = new Pikaday({ field: document.getElementById('endDate'), });
    this.addDateSelectClickHandler();
  }

  addMouseOverHandler() {
    // dead code
    const dateSelectDiv = document.getElementById('twitter-select-date-container');
    const datePickerDiv = document.getElementById('twitter-select-date');
    dateSelectDiv.addEventListener('mouseenter', event => { //eslint-disable-line no-unused-vars
      datePickerDiv.style.display = datePickerDiv.style.display === 'none' ? '' : 'none';
    }, false);
  }

  addMouseLeaveHandler() {
    // dead code
    const dateSelectDiv = document.getElementById('twitter-select-date-container');
    const datePickerDiv = document.getElementById('twitter-select-date');
    dateSelectDiv.addEventListener('mouseleave', event => { //eslint-disable-line no-unused-vars
      datePickerDiv.style.display = 'none';
    }, false);
  }

  addDateSelectClickHandler() {
    // Dead code now
    const dateSelectDiv = document.getElementById('twitter-select-date-container');
    const datePickerDiv = document.getElementById('twitter-select-date');
    dateSelectDiv.addEventListener('click', event => { //eslint-disable-line no-unused-vars
      datePickerDiv.style.display = datePickerDiv.style.display === 'none' ? '' : 'none';
    }, false);
  }

  getStartDate() {
    const startDate = document.getElementById('startDate').value;
    return startDate;
  }

  getEndDate() {
    const endDate = document.getElementById('endDate').value;
    return endDate;
  }

}

export default TwitterDateHandler;

