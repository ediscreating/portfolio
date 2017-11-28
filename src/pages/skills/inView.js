let elements = [];
let scrollTop = window.pageYOffset;
let htmlHeight = document.documentElement.clientHeight;
let htmlWidth = document.documentElement.clientWidth;
let cb = undefined;
let updated = false;
let endWaitingTO = undefined;
let targetScrollPositions = [];

function update() {
  clearTimeout(endWaitingTO);

  endWaitingTO = setTimeout(() => {
    cb(check());
  }, 200);
}

function check() {
  let newInView = [];
  let el;
  let isInView;

  for (let i = 0; i < elements.length; i+=2) {
    isInView = isElementInView(elements[i][0]);
    if (isInView && !elements[i + 1]) newInView.push(elements[i][0]);
    elements[i + 1] = isInView;
  }

  return newInView;
}

function isElementInView(el) {
   let target = getTargetScroll(el);

   if (Array.isArray(target)) {
     let one = target[0], two = target[1];
     return !(one > scrollTop + htmlHeight && two > scrollTop + htmlHeight ||
            one < scrollTop && two < scrollTop);
   }

   return target >= scrollTop && target <= scrollTop + htmlHeight;
}

function getTargetScroll(el) {
  return targetScrollPositions[targetScrollPositions.indexOf(el) + 1];
}

function calculateTargetScrollPosition(el, treshold) {
  if (window.getComputedStyle(el).position === 'fixed') {
    return [0, Infinity];
  }

  const coords = calcCoordsIgnoringTransform(el);

  let targetScroll;
  let elHeight = el.clientHeight;

  if (elHeight > htmlHeight) {
    targetScroll = [coords.top + (elHeight * treshold), (coords.top + elHeight) - (elHeight * treshold)];
  } else {
    targetScroll = coords.top + (elHeight * treshold);
  }

  return targetScroll;
}

function calcCoordsIgnoringTransform(el) {
  let offsetLeft = 0;
  let offsetTop  = 0;

  do {
    offsetLeft += el.offsetLeft;
    offsetTop  += el.offsetTop;
    el = el.offsetParent;
  } while (el);

  return { left: offsetLeft, top: offsetTop };
}

function handleScroll() {
  scrollTop = window.pageYOffset;
  update();
}

function handleResize() {
  clearTimeout(endWaitingTO);

  htmlHeight = document.documentElement.clientHeight;
  targetScrollPositions = [];

  let elInfo;
  for (let i = 0; i < elements.length; i+=2) {
    elInfo = elements[i];
    targetScrollPositions.push(elInfo[0], calculateTargetScrollPosition(elInfo[0], elInfo[1]));
  }

  update();
}

function updateData() {
  htmlHeight = document.documentElement.clientHeight;
  scrollTop = window.pageYOffset;
  targetScrollPositions = [];

  let elInfo;
  for (let i = 0; i < elements.length; i+=2) {
    elInfo = elements[i];
    targetScrollPositions.push(elInfo[0], calculateTargetScrollPosition(elInfo[0], elInfo[1]));
    elements[i + 1] = isElementInView(elInfo[0]);
  }

  updated = true;
}

const inView = {
  init(els, callback) {
    cb = callback;

    els.forEach(elInfo => {
      elements.push(elInfo, false);
    });

    return this;
  },
  start() {
    if (!updated) updateData();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return this;
  },
  stop() {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleResize);
    updated = false;
    return this;
  },
  getVisible() {
    if (!updated) updateData();

    return elements.filter((elInfo, i) => {
      if (i % 2 !== 0) return false;
      return elements[i + 1];
    }).map(elInfo => elInfo[0]);
  }
};

export default inView;
