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

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_sourceMapSupport2.default.install();

var LocalStrategy = require('passport-local').Strategy;
var app = (0, _express2.default)();
app.use(_express2.default.static('dist'));
app.use(_bodyParser2.default.json());

app.use((0, _expressSession2.default)({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
})

//
// Passport init
//
);app.use(_passport2.default.initialize());
app.use(_passport2.default.session());

_passport2.default.serializeUser(function (user, done) {
  done(null, user);
});

_passport2.default.deserializeUser(function (user, done) {
  done(null, user);
}

/*
passport.deserializeUser(function (id, done) {
userDb.findById(id, function (err, user) {
  done(err, user)
})
})
*/

);_passport2.default.use(new LocalStrategy(function (username, password, done) {
  if (username === 'admin' && password === 'admin') {
    return done(null, { name: 'admin' });
  }
  return done(null, false, { message: 'bad login info' });
})

/*
userDb.findOne({ username: username }, function (err, user) {
  if (err) { return done(err) }
  if (!user) {
    return done(null, false, { message: 'Incorrect username.' })
  }
  if (!user.validPassword(password)) {
    return done(null, false, { message: 'Incorrect password.' })
  }
  return done(null, user)
})
}
))
*/

);var userDb = void 0;

_mongodb.MongoClient.connect('mongodb://localhost/loginapp').then(function (connection) {
  userDb = connection;
}).catch(function (error) {
  console.log('ERROR: ', error);
});

app.get('/protected', ensureAuthenticated, function (req, res) {
  res.send('hi');
});

app.get('/showusers', function (req, res) {
  userDb.collection('users').findOne({ username: 'lockwood' }).then(function (users) {
    console.log(users);
  }).catch(function (error) {
    console.log(error);
  });
  res.send('sent');
});

app.post('/login', _passport2.default.authenticate('local'), function (req, res) {
  res.send('logged in');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.send('not authenticated');
  }
}

app.get('/api/bookmarks', function (req, res) {
  var filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  bookmarkDb.collection('bookmarks').find(filter).toArray().then(function (bookmarks) {
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

  bookmarkDb.collection('bookmarks').insertOne(newSite).then(function (result) {
    return db.collection('bookmarks').find({ _id: result.insertedId }).limit(1).next();
  }).then(function (newSite) {
    res.json(newSite);
  }).catch(function (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error: ' + error });
  });
});

app.delete('/api/bookmarks/:id', function (req, res) {
  var bookmarkId = void 0;
  try {
    bookmarkId = new _mongodb.ObjectId(req.params.id);
  } catch (error) {
    res.status(422).json({ message: 'Invalid issue ID format: ' + error });
    return;
  }

  bookmarkDb.collection('bookmarks').deleteOne({ _id: bookmarkId }).then(function (deleteResult) {
    if (deleteResult.result.n === 1) res.json({ status: 'OK' });else res.json({ status: 'Warning: object not found' });
  }).catch(function (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error: ' + error });
  });
});

app.get('*', function (req, res) {
  res.sendFile(_path2.default.resolve('dist/index.html'));
});

var bookmarkDb = void 0;

_mongodb.MongoClient.connect('mongodb://localhost/bookmarks').then(function (connection) {
  bookmarkDb = connection;
}).catch(function (error) {
  console.log('ERROR: ', error);
});

app.listen(3000, function () {
  console.log('App started on port 3000');
});
//# sourceMappingURL=server.js.map