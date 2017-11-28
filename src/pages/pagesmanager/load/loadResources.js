function loadResources(resources) {
  if (resources.length === 0) return;

  return new Promise(function(resolve, reject) {
    let counter = 0;

    function handleResourceLoad() {
      counter += 1;
      if (resources.length === counter) resolve();
    }

    resources.forEach(obj => {
      obj.resource.onload = handleResourceLoad;
      obj.resource.onerror = reject;
      obj.resource.setAttributeNS(obj.ns, obj.srcAttr, obj.src);
    });
  });
}

export default loadResources;
