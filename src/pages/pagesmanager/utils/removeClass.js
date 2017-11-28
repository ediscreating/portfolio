function removeClass(el, className) {
    const i = el.className.indexOf(className);

    if (i === -1) return;

    const elClass = el.className.split('');
    const l = className.length;

    if (
      (elClass[i - 1] === " " || !Boolean(elClass[i - 1])) &&
      (elClass[i + l] === " " || !Boolean(elClass[i + l]))
    ) {
      el.className = [].concat(
        elClass.slice(0, i),
        elClass.slice(i + l)
      ).join('').trim().split(' ').filter(Boolean).join(' ');
    }
}

export default removeClass;
