import Pikaday from 'pikaday';

class TwitterDateHandler {

  constructor() {
    this.startDatePicker = new Pikaday({ field: document.getElementById('startDate'), });
    this.endDatePicker = new Pikaday({ field: document.getElementById('endDate'), });
    this.addDateSelectClickHandler();
  }

  addDateSelectClickHandler() {
    const dateSelectDiv = document.getElementById('dateSelectHeader');
    const datePickerDiv = document.getElementById('dateRangeSelect');
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

