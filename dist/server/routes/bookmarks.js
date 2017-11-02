function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import express from 'express';
import { ObjectId } from 'mongodb';

import ensureAuthenticated from '../auth/passport';
import { addBookmark, getBookmarks, deleteBookmark, editBookmark, discover } from '../models/db';
import { validateBookmark, validateEdit } from '../models/bookmark';

const bookmarks = express.Router();

bookmarks.get('/protected', ensureAuthenticated, (req, res) => {
  res.status(200).json({ name: res.req.user.name });
});

bookmarks.get('/bookmarks', ensureAuthenticated, (() => {
  var _ref = _asyncToGenerator(function* (req, res) {
    const userDb = req.session.passport.user;

    try {
      const result = yield getBookmarks(userDb);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})());

bookmarks.get('/discover', ensureAuthenticated, (() => {
  var _ref2 = _asyncToGenerator(function* (req, res) {
    const userDb = req.session.passport.user;

    try {
      const result = yield discover(userDb);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
  });

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
})());

bookmarks.post('/bookmarks', ensureAuthenticated, (req, res) => {
  const userDb = req.session.passport.user;
  const newBookmark = req.body;
  newBookmark.created = new Date().getTime();
  const errors = validateBookmark(newBookmark);
  if (errors) {
    res.status(400).json(errors);
    return;
  }

  addBookmark(`bookmarks.${userDb}`, newBookmark).then(() => res.status(200).send('1 record inserted')).catch(error => res.status(500).json({ message: `Internal Server Error: ${error}` }));
});

bookmarks.delete('/bookmarks/:id', ensureAuthenticated, (() => {
  var _ref3 = _asyncToGenerator(function* (req, res) {
    const userDb = req.session.passport.user;
    let bookmarkId;
    try {
      bookmarkId = new ObjectId(req.params.id);
    } catch (error) {
      res.status(422).json({ message: `Invalid id format: ${error}` });
      return;
    }

    try {
      yield deleteBookmark(`bookmarks.${userDb}`, bookmarkId);
      res.status(200).json({ message: 'Successfully deleted object' });
    } catch (error) {
      if (error.message === '404') {
        res.status(404).json({ message: 'Bookmark not found' });
        return;
      }
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
  });

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
})());

bookmarks.patch('/bookmarks', ensureAuthenticated, (() => {
  var _ref4 = _asyncToGenerator(function* (req, res) {
    const userDb = req.session.passport.user;
    const site = req.body;
    site.updated = new Date().getTime();

    const errors = validateEdit(site);
    if (errors) {
      res.status(422).json(errors);
      return;
    }

    try {
      yield editBookmark(`bookmarks.${userDb}`, site);
      res.status(200).json({ message: 'Edit site success' });
    } catch (error) {
      res.status(422).json({ message: `Invalid id format: ${error}` });
    }
  });

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
})());

export default bookmarks;
//# sourceMappingURL=bookmarks.js.map