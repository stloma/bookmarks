import express from 'express';
import passport from 'passport';

import { CreateUser, validateRegistration } from '../models/user';
import ensureAuthenticated from '../auth/passport';

const user = express.Router();

user.get('/logout', ensureAuthenticated, (req, res) => {
  req.session.destroy();
  req.logout();
  res.redirect('/login');
});

user.post('/login', passport.authenticate('local'), (req, res) => {
  res.status(200).json({ name: res.req.user.name });
});

user.post('/registeruser', async (req, res) => {
  const newUser = req.body;
  newUser.created = new Date().getTime();

  const inputErrors = validateRegistration(newUser);

  if (inputErrors) { res.status(400).json(inputErrors); }

  try {
    const result = await CreateUser(newUser);

    res.status(200).json(`Successfully registered ${result.username}`);
  } catch (error) {
    if (error.code === 11000) {
      // If the same username already exists
      const inputType = error.message.split('$')[1].split(' ')[0];
      res.status(409).json([`${inputType} already registered`]);
      return;
    }
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  }
});

export default user;
