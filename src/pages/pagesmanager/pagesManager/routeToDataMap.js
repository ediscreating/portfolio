import PageData from './PageData';

const routeToDataMap = {
  '/index.html': new PageData('/index.html'),
  '/skills.html': new PageData('/skills.html'),
  '/works.html': new PageData('/works.html')
};

routeToDataMap['/'] = routeToDataMap['/index.html'];

export default routeToDataMap;
