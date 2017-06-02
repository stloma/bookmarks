'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongodb = require('mongodb');

var _bookmark = require('./bookmark.js');

var _bookmark2 = _interopRequireDefault(_bookmark);

var _sourceMapSupport = require('source-map-support');

var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_sourceMapSupport2.default.install();

var app = (0, _express2.default)();
app.use(_express2.default.static('dist'));
app.use(_bodyParser2.default.json());

app.get('/api/bookmarks', function (req, res) {
  var filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  db.collection('bookmarks').find(filter).toArray().then(function (bookmarks) {
    var metadata = { total_count: bookmarks.length };
    res.json({ _metadata: metadata, records: bookmarks });
  }).catch(function (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error: ' + error });
  });
});

app.post('/api/bookmarks', function (req, res) {
  var newSite = req.body;
  newSite.created = new Date().getTime();
  var err = _bookmark2.default.validateSite(newSite);
  console.log(err);
  if (err) {
    res.status(422).json({ message: 'Invalid request: ' + err });
    return;
  }

  db.collection('bookmarks').insertOne(newSite).then(function (result) {
    return db.collection('bookmarks').find({ _id: result.insertedId }).limit(1).next();
  }).then(function (newSite) {
    res.json(newSite);
  }).catch(function (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error: ' + error });
  });
});

app.get('*', function (req, res) {
  res.sendFile(_path2.default.resolve('dist/index.html'));
});

var db = void 0;
_mongodb.MongoClient.connect('mongodb://localhost/bookmarks').then(function (connection) {
  db = connection;
  app.listen(3000, function () {
    console.log('App started on port 3000');
  });
}).catch(function (error) {
  console.log('ERROR: ', error);
});
//# sourceMappingURL=server.js.map