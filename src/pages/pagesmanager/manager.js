import {pagesManager} from './pagesManager/';
import load from './load/';
import getLoadableResources from './utils/getLoadableResources';
import removeClass from './utils/removeClass';
import Loading from 'js/loading';

const historyIsSupported = !!(window.history && window.history.pushState);
const isOperaMini = Object.prototype.toString.call(window.operamini) === "[object OperaMini]";

removeClass(document.documentElement, 'no-js');

if (historyIsSupported) {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  pagesManager.init();
  onRouteChange(pagesManager.changePage);
} else if (isOperaMini) {
  Loading.hide();
} else {
  let instance;

  Promise.all([
    load.resources(getLoadableResources(document.getElementsByClassName('page')[0])),
    load.instance(window.location.pathname)
  ]).then(results => {
    instance = results[1];
    instance.init();
    instance.open();
    Loading.hide();
    instance.show();
  });

  onRouteChange(pathname => {
    instance.hide().then(() => {
      Loading.show();
      window.location.href = getURLOrigin() + pathname;
    });
  });
}

function getURLOrigin() {
  const origin = window.location.origin;
  return origin ? origin : window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}

function onRouteChange(handler) {
  if (historyIsSupported) window.addEventListener('popstate', handlePopstate);

  document.addEventListener('click', handleLinkClick);
  window.history.replaceState({}, null, window.location.pathname);

  let firstPopstate = true;

  function handleLinkClick(e) {
    if (e.target.className.indexOf('js:inner-link') !== -1) {
      e.preventDefault();
      const pathname = normalizePathname(e.target.pathname);
      if (pathname !== window.location.pathname) {
        if (historyIsSupported) window.history.pushState({}, null, pathname);
        handler(pathname);
      }
    }
  }

  function normalizePathname(pathname) {
    return (pathname.charAt(0) !== '/' ? '/' : '') + pathname;
  }

  function handlePopstate(e) {
    if (firstPopstate && e.state === null) {
      window.history.pushState({}, null, window.location.pathname);
      return;
    }

    if (firstPopstate) firstPopstate = false;

    handler(window.location.pathname);
  }
}
