import logger from './logger';
import { searchSelectEvent, } from './graphingEvents';

class TwitterUserHandler {

  constructor() {
    logger('Entering twitter user search constructor');
    this.trackedUsers = [];
    this.trackedUsersAdded = false;
    this.getTwitterUserListing();
    this.addUsersClickHandler();
    this.selectedTwitterUsers = [];
    // Attempted to get this width from the element after it's created but returned 0
    // so set here instead. This is also set within 
    this.checkMarkImageWidth = 9;
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
      const userSelectButton = this.createUserSelectionButton(this.trackedUsers[i]);
      const userSelectList = document.createElement('li');
      userSelectList.className = 'twitter-user-list';
      twitterUserList.appendChild(userSelectList);
      userSelectList.appendChild(userSelectButton);
      this.addUserButtonClickHandler(userSelectButton);
    }
  }

  createUserSelectionButton(username) {
    const userSelectButton = document.createElement('button');
    userSelectButton.className = 'twitter-user-button';
    userSelectButton.innerHTML = username;
    return userSelectButton;
  }

  addUserButtonClickHandler(userSelectButton) {
    userSelectButton.addEventListener('click', event => { // eslint-disable-line no-unused-vars
      const buttonListElement = userSelectButton.parentNode;
      if (this.selectedTwitterUsers.includes(userSelectButton.innerHTML)) {
        for (let i = 0; i < buttonListElement.childNodes.length; i += 1) { // eslint-disable-line id-length, max-len
          if (buttonListElement.childNodes[i].className === 'user-checkmark') {
            buttonListElement.childNodes[i].remove();
            const newButtonWidth = userSelectButton.clientWidth + this.checkMarkImageWidth;
            userSelectButton.setAttribute('style',`width:${newButtonWidth}px`);
            userSelectButton.style.width = `${newButtonWidth}px`;
            this.removeSelectedUser(userSelectButton.innerHTML);
            this.moveButtonToBottomOfList(userSelectButton);
            break;
          }
        }
      } else {
        const checkContainer = document.createElement('div');
        checkContainer.className = 'user-checkmark-div';
        const checkImagePath = 'static/images/checkmark.png';
        const checkImage = document.createElement('img');
        checkImage.className = 'user-checkmark';
        checkImage.src = checkImagePath;
        const newButtonWidth = userSelectButton.clientWidth - this.checkMarkImageWidth;
        userSelectButton.setAttribute('style',`width:${newButtonWidth}px`);
        userSelectButton.style.width = `${newButtonWidth}px`;
        buttonListElement.appendChild(checkImage);
        this.selectedTwitterUsers.push(userSelectButton.innerHTML);
        this.moveButtonToTopOfList(userSelectButton);
      }
      const searchButton = document.getElementById('graph-search-button');
      searchButton.dispatchEvent(searchSelectEvent);
    }, false);
  }

  moveButtonToTopOfList(userSelectButton) {
    const buttonListElement = userSelectButton.parentNode;
    let previousListSibling = buttonListElement.previousElementSibling;
    const topListLevel = buttonListElement.parentNode;
    while (previousListSibling !== null) {
      topListLevel.insertBefore(buttonListElement, previousListSibling);
      previousListSibling = buttonListElement.previousElementSibling;
    }
  }

  moveButtonToBottomOfList(userSelectButton) {
    const buttonListElement = userSelectButton.parentNode;
    const topListLevel = buttonListElement.parentNode;
    topListLevel.insertBefore(buttonListElement, null);
  }

  removeSelectedUser(username) {
    const usernameIndex = this.selectedTwitterUsers.indexOf(username);
    if (usernameIndex === -1) {
      return;
    }
    this.selectedTwitterUsers.splice(usernameIndex, 1);
  }

  addUsersClickHandler() {
    const userSelectDiv = document.getElementById('twitter-select-user-container');
    const userDisplayDiv = document.getElementById('twitter-select-user');
    userSelectDiv.addEventListener('click', event => { // eslint-disable-line no-unused-vars
      userDisplayDiv.style.display = userDisplayDiv.style.display === 'none' ? '' : 'none';
      this.addTwitterUsersToDocument();
    }, false);
  }

  getSelectedTwitterUsers() {
    return this.selectedTwitterUsers;
  }
}

export default TwitterUserHandler;

