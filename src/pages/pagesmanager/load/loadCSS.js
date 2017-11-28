const iframe = document.getElementsByClassName('js-cssloadlistener')[0];

function loadCSS(link) {
  if (!link) return;

  return new Promise(function (resolve, reject) {
    let interval = undefined;
    let handlerCalled = false;

    function handleLinkLoad(e) {
      if (!handlerCalled) {
        handlerCalled = true;
        clearInterval(interval);
        resolve();
      }
    }

    function handleLinkLoadError(e) {
      clearInterval(interval);
      reject(new Error('CSSLoadError'));
    }

    iframe.contentWindow.addEventListener('resize', handleLinkLoad);
    link.addEventListener('load', handleLinkLoad);
    link.addEventListener('error', handleLinkLoadError);

    document.head.appendChild(link);

    const startTime = new Date();
    let endTime;

    interval = setInterval(() => {
      endTime = new Date();
      if (Math.round((endTime - startTime) / 1000) >= 10) {
        handleLinkLoadError();
      }
    }, 1000);

  });
}

export default loadCSS;
