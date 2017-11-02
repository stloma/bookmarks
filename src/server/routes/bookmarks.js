import express from 'express';
import { ObjectId } from 'mongodb';

import ensureAuthenticated from '../auth/passport';
import { addBookmark, getBookmarks, deleteBookmark, editBookmark, discover } from '../models/db';
import { validateBookmark, validateEdit } from '../models/bookmark';

const bookmarks = express.Router();

bookmarks.get('/protected', ensureAuthenticated, (req, res) => {
  res.status(200).json({ name: res.req.user.name });
});


bookmarks.get('/bookmarks', ensureAuthenticated, async (req, res) => {
  const userDb = req.session.passport.user;

  try {
    const result = await getBookmarks(userDb);
    res.json(result);
  } catch (error) { res.status(500).json({ message: `Internal Server Error: ${error}` }); }
});


bookmarks.get('/discover', ensureAuthenticated, async (req, res) => {
  const userDb = req.session.passport.user;

  try {
    const result = await discover(userDb);
    res.json(result);
  } catch (error) { res.status(500).json({ message: `Internal Server Error: ${error}` }); }
});

bookmarks.post('/bookmarks', ensureAuthenticated, (req, res) => {
  const userDb = req.session.passport.user;
  const newBookmark = req.body;
  newBookmark.created = new Date().getTime();
  const errors = validateBookmark(newBookmark);
  if (errors) {
    res.status(400).json(errors);
    return;
  }

  addBookmark(`bookmarks.${userDb}`, newBookmark)
    .then(() => res.status(200).send('1 record inserted'))
    .catch(error => res.status(500).json({ message: `Internal Server Error: ${error}` }));
});

bookmarks.delete('/bookmarks/:id', ensureAuthenticated, async (req, res) => {
  const userDb = req.session.passport.user;
  let bookmarkId;
  try {
    bookmarkId = new ObjectId(req.params.id);
  } catch (error) {
    res.status(422).json({ message: `Invalid id format: ${error}` });
    return;
  }

  try {
    await deleteBookmark(`bookmarks.${userDb}`, bookmarkId);
    res.status(200).json({ message: 'Successfully deleted object' });
  } catch (error) {
    if (error.message === '404') {
      res.status(404).json({ message: 'Bookmark not found' });
      return;
    }
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  }
});

bookmarks.patch('/bookmarks', ensureAuthenticated, async (req, res) => {
  const userDb = req.session.passport.user;
  const site = req.body;
  site.updated = new Date().getTime();

  const errors = validateEdit(site);
  if (errors) {
    res.status(422).json(errors);
    return;
  }

  try {
    await editBookmark(`bookmarks.${userDb}`, site);
    res.status(200).json({ message: 'Edit site success' });
  } catch (error) {
    res.status(422).json({ message: `Invalid id format: ${error}` });
  }
});

export default bookmarks;
