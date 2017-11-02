function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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

user.post('/registeruser', (() => {
  var _ref = _asyncToGenerator(function* (req, res) {
    const newUser = req.body;
    newUser.created = new Date().getTime();

    const inputErrors = validateRegistration(newUser);

    if (inputErrors) {
      res.status(400).json(inputErrors);
    }

    try {
      const result = yield CreateUser(newUser);

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

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})());

export default user;
//# sourceMappingURL=user.js.map