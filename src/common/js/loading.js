import loading from 'html/loading.html';

let loadingIsVisible = true;
let loadingEl = null;

const Loading = {
  show(container) {
    if (loadingIsVisible) return;

    container = container || document.body;
    container.style.overflow = 'hidden';
    container.insertAdjacentHTML('beforeEnd', loading);

    loadingEl = document.getElementsByClassName('js:loading')[0];

    loadingIsVisible = true;
  },
  hide() {
    if (!loadingIsVisible) return;

    if (loadingEl === null && !(loadingEl = document.getElementsByClassName('js:loading')[0])) {
      return;
    }

    const parent = loadingEl.parentNode;
    parent.removeChild(loadingEl);
    parent.style.overflow = '';
    loadingIsVisible = false;
  }
};

export default Loading;
