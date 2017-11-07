'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongodb = require('mongodb');

var _passport = require('../auth/passport');

var _passport2 = _interopRequireDefault(_passport);

var _db = require('../models/db');

var _bookmark = require('../models/bookmark');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bookmarks = _express2.default.Router();

bookmarks.get('/protected', _passport2.default, function (req, res) {
  res.status(200).json({ name: res.req.user.name });
});

bookmarks.get('/bookmarks', _passport2.default, async function (req, res) {
  var userDb = req.session.passport.user;

  try {
    var result = await (0, _db.getBookmarks)(userDb);
    res.json(result);
  } catch (error) {
    res.status(500).json('Internal Server Error: ' + error);
  }
});

bookmarks.get('/discover', _passport2.default, async function (req, res) {
  var userDb = req.session.passport.user;

  try {
    var result = await (0, _db.discover)(userDb);
    res.json(result);
  } catch (error) {
    res.status(500).json('Internal Server Error: ' + error);
  }
});

bookmarks.post('/bookmarks', _passport2.default, function (req, res) {
  var userDb = req.session.passport.user;
  var newBookmark = req.body;
  newBookmark.created = new Date().getTime();

  if (!newBookmark.url.match(/^https?/)) newBookmark.url = 'http://' + newBookmark.url;

  var errors = (0, _bookmark.validateBookmark)(newBookmark);
  if (errors) {
    res.status(400).json(errors);
    return;
  }

  (0, _db.addBookmark)('bookmarks.' + userDb, newBookmark).then(function () {
    return res.status(200).send('1 record inserted');
  }).catch(function (error) {
    return res.status(500).json('Internal Server Error: ' + error);
  });
});

bookmarks.delete('/bookmarks/:id', _passport2.default, async function (req, res) {
  var userDb = req.session.passport.user;
  var bookmarkId = void 0;
  try {
    bookmarkId = new _mongodb.ObjectId(req.params.id);
  } catch (error) {
    res.status(422).json('Invalid id format: ' + error);
    return;
  }

  try {
    await (0, _db.deleteBookmark)('bookmarks.' + userDb, bookmarkId);
    res.status(200).json('Successfully deleted object');
  } catch (error) {
    if (error.message === '404') {
      res.status(404).json('Bookmark not found');
      return;
    }
    res.status(500).json('Internal Server Error: ' + error);
  }
});

bookmarks.patch('/bookmarks', _passport2.default, async function (req, res) {
  var userDb = req.session.passport.user;
  var site = req.body;
  site.updated = new Date().getTime();

  var errors = (0, _bookmark.validateEdit)(site);
  if (errors) {
    res.status(422).json(errors);
    return;
  }

  try {
    await (0, _db.editBookmark)('bookmarks.' + userDb, site);
    res.status(200).json('Edit site success');
  } catch (error) {
    res.status(422).json('Invalid id format: ' + error);
  }
});

exports.default = bookmarks;
//# sourceMappingURL=bookmarks.js.map