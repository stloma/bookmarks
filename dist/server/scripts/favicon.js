'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = download;

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function download(url, id) {
  var address = url.match(/^(https?:\/\/){1}[^-][a-z0-9.-]+[^-]\.[a-z]{2,4}/);
  if (address) {
    address = address[0];
  }
  var options = {
    uri: address + '/favicon.ico',
    encoding: null,
    followRedirect: true,
    timeout: 5000,
    maxRedirect: 5
  };

  return (0, _requestPromise2.default)(options).then(function (result) {
    return _fsExtra2.default.outputFile(_path2.default.join(__dirname, '../../../dist/images/favicons/' + id + '.ico'), result);
  }).then(function () {
    return 200;
  }).catch(function (error) {
    return error;
  });
}
//# sourceMappingURL=favicon.js.map