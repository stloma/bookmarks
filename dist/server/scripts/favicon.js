'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.download = download;

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function download(url, id) {
  var options = {
    uri: url + '/favicon.ico',
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

/*
return rp(options)
.then(result => {
  return Promise.all([
    result,
    fs.outputFile(path.join(__dirname, `../../../dist/images/favicons/${id}.ico`), result)
  ])
})
.then(result => result)
.catch(error => console.log(error))
}
*/
/*
request({
url: url + '/favicon.ico',
encoding: null,
followRedirect: true,
timeout: 5000,
maxRedirect: 5
}, function (err, res, body) {
if (err) {
callback(err)
} else if (res.statusCode === 200) {
fs.writeFile(
  path.join(__dirname, `../../../dist/images/favicons/${id}.ico`), body, function (err) {
    if (err) {
      callback(err)
    }
    callback(null, res.statusCode)
  })
} else {
callback(null, res.statusCode)
}
})
*/
//# sourceMappingURL=favicon.js.map