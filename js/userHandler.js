import logger from './logger';

class TwitterUserHandler {

  constructor() {
    logger('Entering twitter user search constructor');
    this.trackedUsers = [];
    this.trackedUsersAdded = false;
    this.getTwitterUserListing();
    this.addUsersClickHandler();
    this.checkBoxClassName = 'twitterUserSelection';
  }

  getTwitterUserListing() {
    const request = new XMLHttpRequest();
    request.open('GET', 'eleanor/twitter-users', true);
    request.onload = () => {
      if (request.status === 200 || request.status === 204) {
        logger('Successful response on getting twitter users');
        this.trackedUsers = JSON.parse(request.response);
      } else {
        logger('Request to get listing of twitter users failed');
      }
    };
    request.send(null);
  }

  addTwitterUsersToDocument() {
    if (this.trackedUsersAdded === true) {
      logger('Users have already been added, returning');
      return;
    }
    this.trackedUsersAdded = true;
    logger('Adding twitter users to document');
    const twitterUserList = document.getElementById('twitter-users');
    for (let i = 0; i < this.trackedUsers.length; i += 1) { // eslint-disable-line id-length
      const checkboxList = document.createElement('li');
      const checkboxLabel = document.createElement('label');
      twitterUserList.appendChild(checkboxList);
      const checkbox = this.createCheckBox(this.trackedUsers[i]);
      checkboxLabel.appendChild(checkbox);
      checkboxLabel.insertAdjacentHTML('beforeend', this.trackedUsers[i]);
      checkboxList.appendChild(checkboxLabel);
    }
  }

  addUsersClickHandler() {
    const userSelectDiv = document.getElementById('twitterSelectHeader');
    const userDisplayDiv = document.getElementById('twitterUserSelect');
    userSelectDiv.addEventListener('click', event => { // eslint-disable-line no-unused-vars
      userDisplayDiv.style.display = userDisplayDiv.style.display === 'none' ? '' : 'none';
      this.addTwitterUsersToDocument();
    }, false);
  }

  removeStyleAttributeFromChildren(parentElement) {
    if (parentElement.hasChildNodes()) {
      parentElement.children.forEach(childNode => {
        if (childNode.hasChildNodes()) {
          this.removeStyleAttributeFromChildren(childNode);
        }
        childNode.removeAttribute('style');
      });
    }
  }

  createCheckBox(username) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'twitterCheckbox';
    checkbox.className = this.checkBoxClassName;
    checkbox.value = username;
    return checkbox;
  }

  getSelectedTwitterUsers() {
    const selectedTwitterUsers = [];
    const userNameCheckBoxes = document.getElementsByClassName(this.checkBoxClassName); 
    // userNameCheckBoxes is an HTMLCollection and therefore forEach is not an option, therefore:
    for (let i = 0; i < userNameCheckBoxes.length; i += 1) { // eslint-disable-line id-length
      if (userNameCheckBoxes[i].checked) {
        selectedTwitterUsers.push(userNameCheckBoxes[i].value);
      }
    }
    return selectedTwitterUsers;
  }
}

export default TwitterUserHandler;

