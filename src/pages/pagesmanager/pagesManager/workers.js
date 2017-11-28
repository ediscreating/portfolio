import load from '../load/';
import PageContent from './PageContent';

export function loadAssets(pageData) {
  if (pageData.areResourcesLoaded || pageData.content.loadableresources.length === 0) return Promise.resolve(pageData);

  return load.resources(pageData.content.loadableresources).then(() => {
    pageData.areResourcesLoaded = true;
    return pageData;
  });
}

export function loadStyles(pageData) {
  if (pageData.isCSSLoaded || !pageData.content.css) return Promise.resolve(pageData);

  return load.css(pageData.content.css).then(() => {
    pageData.isCSSLoaded = true;
    return pageData;
  });
}

export function loadContent(pageData) {
  if (pageData.isContentLoaded) return Promise.resolve(pageData);
  if (pageData.isLoadingContent) return pageData.contentPromise;

  pageData.isLoadingContent = true;

  pageData.contentPromise = load.content(pageData.route).then(contentString => {
    pageData.contentPromise = null;
    pageData.setContent(new PageContent(contentString));
    return pageData;
  }).catch(err => {
    pageData.isLoadingContent = false;
    throw err;
  });

  return pageData.contentPromise;
}

export function loadInstance(pageData) {
  if (pageData.isInstanceLoaded) return Promise.resolve(pageData);
  if (pageData.isLoadingInstance) return pageData.instancePromise;

  pageData.isLoadingInstance = true;

  pageData.instancePromise = load.instance(pageData.route).then(instance => {
    pageData.instance = instance;
    pageData.isInstanceLoaded = true;
    pageData.instancePromise = null;
    return pageData;
  }).catch(err => {
    pageData.isLoadingInstance = false
    throw err;
  });

  return pageData.instancePromise;
}

export function updateContent(pageData) {
  pageData.content.update();
  return pageData;
}

export function hideContent(pageData) {
  pageData.content.hide();
  return pageData;
}

export function showContent(pageData) {
  pageData.content.show();
  return pageData;
}

export function initPage(pageData) {
  if (pageData.isPageInitted || !pageData.isInstanceLoaded) return pageData;
  pageData.instance.init();
  pageData.isPageInitted = true;
  return pageData;
}

export function openPage(pageData) {
  if (pageData.isPageOpened || !pageData.isInstanceLoaded) return pageData;
  pageData.instance.open();
  pageData.isPageOpened = true;
  return pageData;
}

export function showPage(pageData) {
  if ((!pageData.isPageHided && !pageData.pageIsHiding) || !pageData.isInstanceLoaded) return pageData;
  pageData.instance.show();
  pageData.pageIsHiding = false;
  pageData.isPageHided = false;
  return pageData;
}

export function hidePage(pageData) {
  if (pageData.isPageHided || !pageData.isInstanceLoaded) return Promise.resolve(pageData);
  if (pageData.pageIsHiding) return pageData.hidePromise;

  pageData.pageIsHiding = true;

  pageData.hidePromise = pageData.instance.hide().then(() => {
                            pageData.pageIsHiding = false;
                            pageData.isPageHided = true;
                            pageData.hidePromise = null;
                            return pageData;
                          });

  return pageData.hidePromise;
}

export function closePage(pageData) {
  if (!pageData.isPageOpened) return pageData;
  pageData.instance.close();
  pageData.isPageOpened = false;
  return pageData;
}
