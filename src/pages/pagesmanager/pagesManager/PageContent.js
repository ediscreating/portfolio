import appendChildrenTo from '../utils/appendChildrenTo';
import getLoadableResources from '../utils/getLoadableResources';
import getDOMTreeFromString from '../utils/getDOMTreeFromString';

const root = document.querySelector('.page');

function PageContent(dom) {
  if (typeof dom === 'string') dom = getDOMTreeFromString(dom);

  const page = dom.querySelector('.page');

  this.content = Array.prototype.slice.call(page.children);
  this.className = page.className;
  this.loadableresources = getLoadableResources(dom);
  this.css = getStylesheet(dom);
  this.isContentUpdated = false;
}

PageContent.prototype = {
  update() {
    while (root.hasChildNodes()) {
      root.removeChild(root.firstChild);
    }

    root.className = this.className;
    appendChildrenTo(root, this.content);
  },
  hide() {
    root.style.display = 'none';
  },
  show() {
    root.style.display = '';
  }
};

function getStylesheet(dom) {
  return filterLinksByHREFs(dom.getElementsByTagName('link'), getHREFs(document.getElementsByTagName('link')))[0];
}

function filterLinksByHREFs(links, hrefs) {
  return Array.from(links).filter(l => { return hrefs.indexOf(l.href) === -1; });
}

function getHREFs(links) {
  return Array.prototype.map.call(links, link => {
    return link.href;
  });
}

export default PageContent;
