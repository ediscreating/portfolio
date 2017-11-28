import errorView from 'js/errorView';
import routeToDataMap from './routeToDataMap';
import {isNextRoute} from './';
import {loadContent} from './workers';

let canShowErrors = false;

const messages = {
  CanNotLoadContent: 'Can\'t load content, probably there is no internet connection. Trying to reconnect...',
  ContentLoadFailed: 'Content load failed, please check your internet connection and reload the page.',
  CSSLoadError: 'CSS load failed, please check your internet connection and reload the page.'
};

function handleContentLoadError(err) {
  if (err.message !== 'CanNotLoadContent') return;

  let reconnectionCounter = 0;

  const pageData = routeToDataMap[err.route];
  const errorMessage = messages[err.message];

  if (canShowErrors) errorView.show(errorMessage);

  function tryToLoad(resolve, reject) {
    loadContentWithTimeout(pageData, 5000).then(pageData => {
      errorView.hide();
      resolve(pageData);
    }).catch(err => {
      if (!isNextRoute(err.route)) {
        reject(new Error());
        return;
      }

      reconnectionCounter++;

      if (canShowErrors) {
        errorView.show(errorMessage + ' Attempts: ' + reconnectionCounter);
      }

      if (reconnectionCounter === 3) {
        reject(new Error('ContentLoadFailed'));
        return;
      }

      tryToLoad(resolve, reject);
    });
  }

  return new Promise(tryToLoad);
}


function loadContentWithTimeout(pageData, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      loadContent(pageData).then(resolve).catch(reject);
    }, delay);
  });
}

function handleErrors(err) {
  console.log(err.message);
  if (!messages[err.message]) return;

  if (canShowErrors) {
    errorView.show(messages[err.message]);
  }
}

const errorHandler = {
  contentLoadError: handleContentLoadError,
  genericError: handleErrors,
  showErrorMessages(bool) {
    if (errorView.isVisible() && !bool) errorView.hide();
    canShowErrors = bool;
  }
};

export default errorHandler;
