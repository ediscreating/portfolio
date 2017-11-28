import {
  loadInstance,
  loadContent,
  loadAssets,
  loadStyles,
  updateContent,
  initPage,
  openPage,
  showPage,
  hidePage,
  closePage,
  showContent,
  hideContent
} from './workers';
import PageContent from './PageContent';
import routeToDataMap from './routeToDataMap';
import Loading from 'js/loading';
import errorHandler from './errorHandler';

let currentRoute;
let nextRoute;

const pagesManager = {
  init() {
    currentRoute = window.location.pathname;
    nextRoute = currentRoute;

    const pageData = routeToDataMap[currentRoute].setContent(new PageContent(document.body));

    waitAll(loadAssets(pageData), loadInstance(pageData)).then(results => {
      if (currentRoute === window.location.pathname) {
        openPage(initPage(results[1]));
        Loading.hide();
        showPage(results[1]);
      }
    });
  },
  changePage(nextPagesRoute) {
    errorHandler.showErrorMessages(false);

    nextRoute = nextPagesRoute;

    const currentPageData = routeToDataMap[currentRoute];
    const nextPageData = routeToDataMap[nextRoute];

    if (areSameRoutes(nextRoute, currentRoute) && currentPageData.pageIsHiding) {
      currentPageData.hidePromise = null;
      showPage(currentPageData);
      return;
    }

    const wrap = createWrapper(nextRoute);

    waitAll(
      waitAll(
        hidePage(currentPageData).then(pageData => closePage(showLoading(pageData))),
        loadContent(nextPageData).catch(errorHandler.contentLoadError)
      ).then(results => loadExtraResources(wrap(hideContent)(results[1]))).then(wrap(updateContent)),
      loadInstance(nextPageData).catch(err => false)
    ).then(pageData => lastStep(wrap(showContent)(pageData[0])))
     .catch(errorHandler.genericError);
  }
};

function showLoading(pageData) {
  errorHandler.showErrorMessages(true);
  Loading.show();
  return pageData;
}

function loadExtraResources(pageData) {
  return waitAll(
    loadAssets(pageData).catch(arg => arg),
    loadStyles(pageData)
  ).then(results => results[0]);
}

function lastStep(pageData) {
  openPage(initPage(pageData));
  currentRoute = pageData.route;
  Loading.hide();
  showPage(pageData);
}

function waitAll() {
  return Promise.all(arguments);
}

function createWrapper(route) {
  return function(fn) {
    return function() {
      if (!isNextRoute(route)) throw new Error('RouteChanged');
      return fn.apply(null, arguments);
    }
  }
}

function isNextRoute(route) {
  return areSameRoutes(route, nextRoute);
}

function areSameRoutes(routeOne, routeTwo) {
  const indexRoutes = ['/', ''];
  routeOne = indexRoutes.indexOf(routeOne) !== -1 ? '/index.html' : routeOne;
  routeTwo = indexRoutes.indexOf(routeTwo) !== -1 ? '/index.html' : routeTwo;
  return routeOne === routeTwo;
}

export {pagesManager, isNextRoute};
