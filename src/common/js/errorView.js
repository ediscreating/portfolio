import errorViewHTML from 'html/error-message.html';

let container = document.body;
let isErrorVisible = false;
let errorViewEl = null;
let errorMsgEl = null;
let currentMSG = '';

const errorView = {
  show(message) {
    if (currentMSG === message) return;

    container.style.overflow = 'hidden';

    if (!errorViewEl && !errorMsgEl) {
      container.insertAdjacentHTML('beforeEnd', errorViewHTML);
      errorViewEl = document.getElementsByClassName('js-errorview')[0];
      errorMsgEl = errorViewEl.getElementsByClassName('js-errorview-msg')[0];
      errorMsgEl.innerHTML = message;
      currentMSG = message;
    } else {
      errorMsgEl.innerHTML = message;
      container.appendChild(errorViewEl);
    }


    isErrorVisible = true;
  },
  hide() {
    if (!isErrorVisible) return;

    if (errorViewEl === null && !(errorViewEl = document.getElementsByClassName('js:loading')[0])) {
      return;
    }

    const parent = errorViewEl.parentNode;
    parent.removeChild(errorViewEl);
    parent.style.overflow = '';
    currentMSG = '';
    isErrorVisible = false;
  },
  isVisible() {
    return isErrorVisible;
  }
};

export default errorView;
