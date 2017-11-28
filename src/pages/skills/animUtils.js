export function getAnimLabelFromClass(className) {
  return className.split(' ').find(name => name.indexOf('js-animate') !== -1).split('-')[2];
}

export function getAnimPositionFromClass(className) {
  const pos = className.split(' ').find(name => name.indexOf('js-anim-position') !== -1).split('-')[3];
  const parsed = parseInt(pos);
  if (isNaN(parsed))  return pos;
  return parsed;
}

export function sortElementsByAnimPosition(elements) {
  return elements.sort((elOne, elTwo) => {
    let elOnePos = getAnimPositionFromClass(elOne.className);
    let elTwoPos = getAnimPositionFromClass(elTwo.className);

    elOnePos = elOnePos === 'last' ? elements.length - 1 : elOnePos === 'first' ? 0 : elOnePos;
    elTwoPos = elTwoPos === 'last' ? elements.length - 1 : elTwoPos === 'first' ? 0 : elTwoPos;

    return elOnePos - elTwoPos;
  });
}

export function createTween(element, tweenInfo) {
  if (tweenInfo.from && tweenInfo.to) return TweenLite.fromTo(element, tweenInfo.duration, tweenInfo.from, tweenInfo.to);
  if (tweenInfo.to) return TweenLite.to(element, tweenInfo.duration, tweenInfo.to);
}
