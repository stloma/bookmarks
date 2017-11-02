require('babel-register')({
  presets: ['es2015'],
  plugins: ['transform-async-to-generator']
});
require('babel-polyfill');

require('./server.js');
//# sourceMappingURL=start_hook.js.map