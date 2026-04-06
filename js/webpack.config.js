const config = require('flarum-webpack-config');
const base = config();

// Override externals to support both Flarum 1.x (flarum.core.compat) and 2.x (flarum.reg.get)
base.externals = [
  { jquery: 'jQuery' },
  function ({ request }, callback) {
    let namespace;
    let id;
    let matches;

    if ((matches = /^flarum\/(.+)$/.exec(request))) {
      namespace = 'core';
      id = matches[1];
    } else if ((matches = /^ext:([^\/]+)\/(?:flarum-(?:ext-)?)?([^\/]+)(?:\/(.+))?$/.exec(request))) {
      namespace = `${matches[1]}-${matches[2]}`;
      id = matches[3];
    } else {
      return callback();
    }

    // Compatible with both 1.x (flarum.core.compat) and 2.x (flarum.reg.get)
    const code = namespace === 'core'
      ? `(typeof flarum.reg !== 'undefined' && typeof flarum.reg.get === 'function' ? flarum.reg.get('core', '${id}') : flarum.core.compat['${id}'])`
      : `(typeof flarum.reg !== 'undefined' && typeof flarum.reg.get === 'function' ? flarum.reg.get('${namespace}', '${id}') : (flarum.extensions['${namespace}'] && flarum.extensions['${namespace}'].compat && flarum.extensions['${namespace}'].compat['${id}']))`;

    return callback(null, `root ${code}`);
  },
];

module.exports = base;
