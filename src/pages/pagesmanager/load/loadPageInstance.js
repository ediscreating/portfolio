const instances = {
  '/index.html': () => import(/* webpackChunkName: "main" */ '../../main/'),
  '/skills.html': () => import(/* webpackChunkName: "skills" */ '../../skills/'),
  '/works.html': () => import(/* webpackChunkName: "works" */ '../../works/')
};

instances['/'] = instances['/index.html'];

function loadPageInstance(route) {
  return instances[route]().then(module => {
    return module.default;
  });
}

export default loadPageInstance;
