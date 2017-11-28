function getLoadableResources(dom) {
  return Array.prototype.map.call(dom.getElementsByClassName('js-loadable-resource'), resource => {
    return {
      resource: resource,
      src: resource.getAttribute('data-src'),
      srcAttr: resource.getAttribute('data-srcattr'),
      ns: resource.getAttribute('data-ns')
    };
  });
}

export default getLoadableResources;
