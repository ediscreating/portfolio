function PageData(route) {
  this.route = route;
  this.instance = null;
  this.content = null;
  this.isContentLoaded = false;
  this.isContentLoading = false;
  this.isInstanceLoaded = false;
  this.isInstanceLoading = false;
  this.areResourcesLoaded = false;
  this.isPageClosed = false;
  this.isPageHided = true;
  this.isPageHiding = false;
  this.isPageInitted = false;
  this.hidePromise = null;
}

PageData.prototype = {
  setContent(pageContent) {
    this.content = pageContent;
    this.isContentLoaded = true;
    return this;
  },
  setInstance(instance) {
    this.instance = instance;
    this.isInstanceLoaded = true;
    return this;
  }
};

export default PageData;
