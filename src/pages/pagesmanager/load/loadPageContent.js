const xhr = new XMLHttpRequest();

let loading = false;
let aborted = false;

function loadPageContent(route) {
  if (loading) {
    aborted = true;
    xhr.abort();
  }

  return new Promise(function(resolve, reject) {
    xhr.open('GET', route, true);

    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;

      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
        resolve(xhr.responseText);
      } else if (xhr.status === 0) {
        if (aborted) {
          aborted = false;
          reject(new ContentLoadError(route, 'LoadAborted'));
        } else {
          reject(new ContentLoadError(route, 'CanNotLoadContent'));
        }
      }

      loading = false;
    }

    xhr.timeout = 5000;

    xhr.send();

    loading = true;
  });
}

function ContentLoadError(route, message) {
  Error.apply(this, arguments);

  this.route = route;
  this.name = "ContentLoadError";
  this.message =  message;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, ContentLoadError);
  } else {
    this.stack = (new Error()).stack;
  }
}

ContentLoadError.prototype = Object.create(Error.prototype);

export default loadPageContent;
