function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import express from 'express';
import bodyParser from 'body-parser';
import SourceMapSupport from 'source-map-support';
import path from 'path';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import { ComparePassword } from './models/user';
import user from './routes/user';
import bookmarks from './routes/bookmarks';
import { db, store } from './models/db';

SourceMapSupport.install();

const app = express();
const LocalStrategy = require('passport-local').Strategy;

app.use(express.static('dist'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: 'jkfd09U&*^F&*56<F5>8df*(DF789SCy89S89c89d*SF9',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store,
  saveUninitialized: true,
  resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((loginUser, done) => {
  done(null, loginUser._id);
});

passport.deserializeUser((() => {
  var _ref = _asyncToGenerator(function* (loginUser, done) {
    done(null, loginUser);
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})());

passport.use(new LocalStrategy((() => {
  var _ref2 = _asyncToGenerator(function* (username, password, done) {
    try {
      const userExists = yield db.bookmarkDb.collection('users').findOne({ username });
      if (!userExists) {
        return done(null, false);
      }
      const isMatch = yield ComparePassword(password, userExists.password);
      if (!isMatch) {
        return done(null, false);
      }
      return done(null, userExists);
    } catch (error) {
      return done(error);
    }
  });

  return function (_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
})()));

app.use('/api', user);
app.use('/api', bookmarks);

app.listen(3000, '127.0.0.1', () => {
  console.log('App started on port 3000');
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve('dist/index.html'));
});
//# sourceMappingURL=server.js.map