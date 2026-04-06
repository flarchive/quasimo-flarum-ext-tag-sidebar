const { NormalModuleReplacementPlugin } = require('webpack');

module.exports = {
  entry: {
    forum: './forum.js',
    admin: './admin.js',
  },

  plugins: [
    new NormalModuleReplacementPlugin(/^@babel\/runtime(.*)/, (resource) => {
      const path = resource.request.split('@babel/runtime')[1];
      resource.request = require.resolve(`@babel/runtime${path}`);
    }),
  ],

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },

  externals: [
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

      // Support both Flarum 1.x (flarum.core.compat) and 2.x (flarum.reg.get)
      const code = namespace === 'core'
        ? `(typeof flarum.reg !== 'undefined' && typeof flarum.reg.get === 'function' ? flarum.reg.get('core', '${id}') : flarum.core.compat['${id}'])`
        : `(typeof flarum.reg !== 'undefined' && typeof flarum.reg.get === 'function' ? flarum.reg.get('${namespace}', '${id}') : (flarum.extensions['${namespace}'] && flarum.extensions['${namespace}'].compat && flarum.extensions['${namespace}'].compat['${id}']))`;

      return callback(null, `root ${code}`);
    },
  ],

  devtool: 'source-map',
};
