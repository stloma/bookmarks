import express from 'express'
import bodyParser from 'body-parser'
import { MongoClient, ObjectId } from 'mongodb'
import SourceMapSupport from 'source-map-support'
import path from 'path'
import session from 'express-session'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import { countBy } from 'lodash'
import { CreateUser, ComparePassword } from './models/user.js'
import { router as user } from './routes/user.js'

import Bookmark from './bookmark.js'

import connectMongo from 'connect-mongodb-session'
const MongoDBStore = connectMongo(session)

SourceMapSupport.install()

const app = express()
const LocalStrategy = require('passport-local').Strategy

app.use(express.static('dist'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/', user)

const store = new MongoDBStore(
  {
    uri: 'mongodb://localhost/bookmarkapp',
    collection: 'sessions'
  })

store.on('error', function (error) {
  if (error) throw error
})

app.use(session({
  secret: 'secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  saveUninitialized: true,
  resave: true
}))

//
// Passport
//
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(function (user, done) {
  done(null, user._id)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

passport.use(new LocalStrategy(
  function (username, password, done) {
    bookmarkDb.collection('users').findOne({ username: username })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' })
        }
        ComparePassword(password, user.password, function (isMatch) {
          if (isMatch) {
            return done(null, user)
          } else {
            return done(null, false, { message: 'Invalid password.' })
          }
        })
      })
  }
))

//
// Start User
//

app.get('/api/logout', ensureAuthenticated, function (req, res) {
  req.session.destroy()
  req.logout()
})

app.post('/api/login', passport.authenticate('local'), function (req, res) {
  res.redirect('/')
})

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.status(401).send('Please login to perform this operation')
  }
}

app.post('/api/registeruser', (req, res) => {
  let newUser = req.body
  newUser.created = new Date().getTime()
  CreateUser(newUser, insertUser)

  function insertUser (newUser) {
    bookmarkDb.collection('users').insertOne(newUser)
    .then(result =>
      bookmarkDb.collection('users').find({ _id: result.insertedId }).limit(1).next()
      ).then(newSite => {
        res.json(newUser)
      }).catch(error => {
        console.log(error)
        res.status(500).json({ message: `Internal Server Error: ${error}` })
      })
  }
})

//
// End Passport, User
//

//
// Start API
//

app.get('/api/bookmarks', ensureAuthenticated, (req, res) => {
  let userDb = req.session.passport.user
  const filter = {}
  if (req.query.status) {
    filter.status = req.query.status
  }
  bookmarkDb.collection('bookmarks.' + userDb).find(filter).toArray()
    .then(bookmarks => {
      let result = countBy(bookmarks.map(function (bookmark) {
        return bookmark.tags
      })
         .join(' ')
        .split(' ')
      )
      let tagcount = []
      Object.keys(result).forEach((tag) => {
        tagcount.push({ value: tag, count: result[tag] })
      })
      console.log(tagcount)
      const metadata = { total_count: bookmarks.length }
      res.json({ _metadata: metadata, tagcount: tagcount, records: bookmarks })
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ message: `Internal Server Error: ${error}` })
    })
})

app.post('/api/bookmarks', ensureAuthenticated, (req, res) => {
  let userDb = req.session.passport.user
  console.log(userDb)
  const newSite = req.body
  console.log(newSite)
  newSite.created = new Date().getTime()
  const err = Bookmark.validateSite(newSite)
  console.log(err)
  if (err) {
    res.status(422).json({ message: `Invalid request: ${err}` })
    return
  }

  bookmarkDb.collection('bookmarks.' + userDb).insertOne(newSite)
    .then(result =>
      bookmarkDb.collection('bookmarks.' + userDb).find({ _id: result.insertedId }).limit(1).next()
      ).then(newSite => {
        res.json(newSite)
      }).catch(error => {
        console.log(error)
        res.status(500).json({ message: `Internal Server Error: ${error}` })
      })
})

app.delete('/api/bookmarks/:id', ensureAuthenticated, (req, res) => {
  let userDb = req.session.passport.user
  let bookmarkId
  try {
    bookmarkId = new ObjectId(req.params.id)
  } catch (error) {
    res.status(422).json({ message: `Invalid issue ID format: ${error}` })
    return
  }

  bookmarkDb.collection('bookmarks.' + userDb).deleteOne({ _id: bookmarkId }).then((deleteResult) => {
    if (deleteResult.result.n === 1) res.json({ status: 'OK' })
    else res.json({ status: 'Warning: object not found' })
  })
    .catch(error => {
      console.log(error)
      res.status(500).json({ message: `Internal Server Error: ${error}` })
    })
})

let bookmarkDb

MongoClient.connect('mongodb://localhost/bookmarkapp')
  .then(connection => {
    bookmarkDb = connection
  })
  .catch(error => {
    console.log('ERROR: ', error)
  })

app.listen(3000, () => {
  console.log('App started on port 3000')
})

//
// End API
//

app.get('*', (req, res) => {
  res.sendFile(path.resolve('dist/index.html'))
})
