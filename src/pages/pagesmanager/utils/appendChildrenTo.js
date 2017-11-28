function appendChildrenTo(container, children) {
  const fragment = document.createDocumentFragment();
  Array.from(children).forEach(child => fragment.appendChild(child));
  container.appendChild(fragment);
}

export default appendChildrenTo;
