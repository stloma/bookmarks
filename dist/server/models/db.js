'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.editBookmark = exports.deleteBookmark = exports.getBookmarks = exports.addBookmark = exports.store = exports.db = exports.discover = undefined;

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _mongodb = require('mongodb');

var _connectMongodbSession = require('connect-mongodb-session');

var _connectMongodbSession2 = _interopRequireDefault(_connectMongodbSession);

var _lodash = require('lodash');

var _favicon = require('../scripts/favicon');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var MongoDBStore = (0, _connectMongodbSession2.default)(_expressSession2.default);

var store = new MongoDBStore({
  uri: 'mongodb://localhost/bookmarkapp',
  collection: 'sessions'
});

store.on('error', function (error) {
  if (error) throw error;
});

var db = {};

_mongodb.MongoClient.connect('mongodb://localhost/bookmarkapp').then(function (connection) {
  db.bookmarkDb = connection;
}).catch(function (error) {
  console.log('Mongo connect error: ' + error);
});

async function getBookmarks(userDb) {
  try {
    // Get user bookmarks
    var bookmarks = await db.bookmarkDb.collection('bookmarks.' + userDb).find().toArray();

    // Tally up tag counts for tagcloud
    var result = (0, _lodash.countBy)(bookmarks.map(function (bookmark) {
      return bookmark.tags;
    }).join(' ').split(' '));
    var tagcount = Object.keys(result).map(function (tag) {
      return { value: tag, count: result[tag] };
    });

    return { tagcount: tagcount, records: bookmarks };
  } catch (error) {
    throw Error(error);
  }
}

async function discover(userDb) {
  try {
    var _ref;

    // Get all collections
    var collections = await db.bookmarkDb.listCollections().toArray();

    // Filter out all bookmark collections that don't belong to the current user
    var ids = collections.filter(function (collection) {
      return collection.name.startsWith('bookmarks') && !collection.name.endsWith(userDb);
    });

    // Get an array of promises
    var promises = ids.map(function (id) {
      return db.bookmarkDb.collection(id.name).find().toArray();
    });

    // Resolve all promises
    var result = await Promise.all(promises);

    // Create one array from the array of users' bookmarks
    var allBookmarks = (_ref = []).concat.apply(_ref, _toConsumableArray(result));

    // Count tags for tagcloud
    var counts = (0, _lodash.countBy)(allBookmarks.map(function (bookmark) {
      return bookmark.tags;
    }).join(' ').split(' '));
    var tagcount = Object.keys(counts).map(function (tag) {
      return { value: tag, count: result[tag] };
    });

    return { tagcount: tagcount, records: allBookmarks };
  } catch (error) {
    throw Error(error);
  }
}

async function addBookmark(userDb, bookmark) {
  try {
    var newBookmark = bookmark;
    var userId = userDb.split('.')[1];

    var res = await db.bookmarkDb.collection(userDb).insertOne(newBookmark);

    // if this is a new bookmark, download favicon and add createdby property
    if (!newBookmark.favicon) {
      // Download favicon
      var _id = new _mongodb.ObjectId(res.insertedId);
      var result = await (0, _favicon.download)(newBookmark.url, _id);

      // If the fetch result of the favicon was not 200, use the default image
      newBookmark.favicon = result === 200 ? _id + '.ico' : 'default-favicon.png';

      // Add created by property to bookmarks for /discover
      var name = await db.bookmarkDb.collection('users').findOne({ _id: new _mongodb.ObjectId(userId) }, { _id: 0, username: 1 });
      newBookmark.createdBy = name.username;
      await db.bookmarkDb.collection(userDb).updateOne({ _id: _id }, { $set: { favicon: newBookmark.favicon, createdBy: newBookmark.createdBy } });
    }
  } catch (error) {
    throw Error(error);
  }
}

async function deleteBookmark(userDb, _id) {
  var result = await db.bookmarkDb.collection(userDb).deleteOne({ _id: _id });

  // If bookmark doesn't exist, return 404
  var error = result.result.n === 1 ? null : 404;

  if (error) throw new Error(error);

  return result;
}

async function editBookmark(userDb, site) {
  var bookmarkId = new _mongodb.ObjectId(site._id);

  try {
    await db.bookmarkDb.collection(userDb).updateOne({ _id: bookmarkId }, { $set: {
        name: site.name,
        url: site.url,
        comment: site.comment,
        tags: site.tags,
        update: site.updated
      } });
  } catch (error) {
    throw Error(error);
  }
}

exports.discover = discover;
exports.db = db;
exports.store = store;
exports.addBookmark = addBookmark;
exports.getBookmarks = getBookmarks;
exports.deleteBookmark = deleteBookmark;
exports.editBookmark = editBookmark;
//# sourceMappingURL=db.js.map