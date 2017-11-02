let getBookmarks = (() => {
  var _ref = _asyncToGenerator(function* (userDb) {
    try {
      // Get user bookmarks
      const bookmarks = yield db.bookmarkDb.collection(`bookmarks.${userDb}`).find().toArray();

      // Tally up tag counts for tagcloud
      const result = countBy(bookmarks.map(function (bookmark) {
        return bookmark.tags;
      }).join(' ').split(' '));
      const tagcount = Object.keys(result).map(function (tag) {
        return { value: tag, count: result[tag] };
      });

      return { tagcount, records: bookmarks };
    } catch (error) {
      throw Error(error);
    }
  });

  return function getBookmarks(_x) {
    return _ref.apply(this, arguments);
  };
})();

let discover = (() => {
  var _ref2 = _asyncToGenerator(function* (userDb) {
    try {
      // Get all collections
      const collections = yield db.bookmarkDb.listCollections().toArray();

      // Filter out all bookmark collections that don't belong to the current user
      const ids = collections.filter(function (collection) {
        return collection.name.startsWith('bookmarks') && !collection.name.endsWith(userDb);
      });

      // Get an array of promises
      const promises = ids.map(function (id) {
        return db.bookmarkDb.collection(id.name).find().toArray();
      });

      // Resolve all promises
      const result = yield Promise.all(promises);

      // Create one array from the array of users' bookmarks
      const allBookmarks = [].concat(...result);

      // Count tags for tagcloud
      const counts = countBy(allBookmarks.map(function (bookmark) {
        return bookmark.tags;
      }).join(' ').split(' '));
      const tagcount = Object.keys(counts).map(function (tag) {
        return { value: tag, count: result[tag] };
      });

      return { tagcount, records: allBookmarks };
    } catch (error) {
      throw Error(error);
    }
  });

  return function discover(_x2) {
    return _ref2.apply(this, arguments);
  };
})();

let addBookmark = (() => {
  var _ref3 = _asyncToGenerator(function* (userDb, bookmark) {
    try {
      const newBookmark = bookmark;
      const userId = userDb.split('.')[1];

      const res = yield db.bookmarkDb.collection(userDb).insertOne(newBookmark);

      // if this is a new bookmark, download favicon and add createdby property
      if (!newBookmark.favicon) {
        // Download favicon
        const _id = new ObjectId(res.insertedId);
        const result = yield download(newBookmark.url, _id);

        // If the fetch result of the favicon was not 200, use the default image
        newBookmark.favicon = result === 200 ? `${_id}.ico` : 'default-favicon.png';

        // Add created by property to bookmarks for /discover
        const name = yield db.bookmarkDb.collection('users').findOne({ _id: new ObjectId(userId) }, { _id: 0, username: 1 });
        newBookmark.createdBy = name.username;
        yield db.bookmarkDb.collection(userDb).updateOne({ _id }, { $set: { favicon: newBookmark.favicon, createdBy: newBookmark.createdBy } });
      }
    } catch (error) {
      throw Error(error);
    }
  });

  return function addBookmark(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
})();

let deleteBookmark = (() => {
  var _ref4 = _asyncToGenerator(function* (userDb, _id) {
    const result = yield db.bookmarkDb.collection(userDb).deleteOne({ _id });

    // If bookmark doesn't exist, return 404
    const error = result.result.n === 1 ? null : 404;

    if (error) throw new Error(error);

    return result;
  });

  return function deleteBookmark(_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
})();

let editBookmark = (() => {
  var _ref5 = _asyncToGenerator(function* (userDb, site) {
    const bookmarkId = new ObjectId(site._id);

    try {
      yield db.bookmarkDb.collection(userDb).updateOne({ _id: bookmarkId }, { $set: {
          name: site.name,
          url: site.url,
          comment: site.comment,
          tags: site.tags,
          update: site.updated
        } });
    } catch (error) {
      throw Error(error);
    }
  });

  return function editBookmark(_x7, _x8) {
    return _ref5.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import session from 'express-session';
import { MongoClient, ObjectId } from 'mongodb';
import connectMongo from 'connect-mongodb-session';
import { countBy } from 'lodash';
import { download } from '../scripts/favicon';

const MongoDBStore = connectMongo(session);

const store = new MongoDBStore({
  uri: 'mongodb://localhost/bookmarkapp',
  collection: 'sessions'
});

store.on('error', error => {
  if (error) throw error;
});

const db = {};

MongoClient.connect('mongodb://localhost/bookmarkapp').then(connection => {
  db.bookmarkDb = connection;
}).catch(error => {
  console.log(`Mongo connect error: ${error}`);
});

export { discover, db, store, addBookmark, getBookmarks, deleteBookmark, editBookmark };
//# sourceMappingURL=db.js.map