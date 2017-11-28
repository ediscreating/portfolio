function getDOMTreeFromString(str) {
  const html = document.createElement('html');
  str = str.replace(/<\/?html>/g, '');
  html.innerHTML = str;
  return html;
}

export default getDOMTreeFromString;
