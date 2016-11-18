class GraphingEvents {
  
  constructor() {
    this.searchSelectionEventString = 'search-form-update';
  }

  createSearchSelectionUpdateEvent() {
    const updateEvent = document.createEvent('Event');
    updateEvent.initEvent(this.searchSelectionEventString, true, true);
    return updateEvent;
  }
}

const graphEvents = new GraphingEvents();
const searchSelectEvent = graphEvents.createSearchSelectionUpdateEvent();
const searchSelectEventString = graphEvents.searchSelectionEventString;

export { searchSelectEvent, searchSelectEventString, };
