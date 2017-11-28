import loadResources from './loadResources';
import loadPageContent from './loadPageContent';
import loadPageInstance from './loadPageInstance';
import loadCSS from './loadCSS';

const load = {
  resources: loadResources,
  content: loadPageContent,
  css: loadCSS,
  instance: loadPageInstance
};

export default load;
