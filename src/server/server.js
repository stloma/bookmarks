import express from 'express'
import bodyParser from 'body-parser'
import { MongoClient, ObjectId } from 'mongodb'
import Bookmark from './bookmark.js'
import SourceMapSupport from 'source-map-support'
import path from 'path'
import passport from 'passport'
import session from 'express-session'
SourceMapSupport.install()

const LocalStrategy = require('passport-local').Strategy
const app = express()
app.use(express.static('dist'))
app.use(bodyParser.json())

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}))

// Passport init
app.use(passport.initialize())
app.use(passport.session())

app.get('/api/bookmarks', (req, res) => {
  const filter = {}
  if (req.query.status) {
    filter.status = req.query.status
  }
  db.collection('bookmarks').find(filter).toArray()
    .then(bookmarks => {
      const metadata = { total_count: bookmarks.length }
      res.json({ _metadata: metadata, records: bookmarks })
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ message: `Internal Server Error: ${error}` })
    })
})

app.post('/api/bookmarks', (req, res) => {
  const newSite = req.body
  newSite.created = new Date().getTime()
  const err = Bookmark.validateSite(newSite)
  console.log(err)
  if (err) {
    res.status(422).json({ message: `Invalid request: ${err}` })
    return
  }

  db.collection('bookmarks').insertOne(newSite)
    .then(result =>
      db.collection('bookmarks').find({ _id: result.insertedId }).limit(1).next()
      ).then(newSite => {
        res.json(newSite)
      }).catch(error => {
        console.log(error)
        res.status(500).json({ message: `Internal Server Error: ${error}` })
      })
})

app.delete('/api/bookmarks/:id', (req, res) => {
  let bookmarkId
  try {
    bookmarkId = new ObjectId(req.params.id)
  } catch (error) {
    res.status(422).json({ message: `Invalid issue ID format: ${error}` })
    return
  }

  db.collection('bookmarks').deleteOne({ _id: bookmarkId }).then((deleteResult) => {
    if (deleteResult.result.n === 1) res.json({ status: 'OK' })
    else res.json({ status: 'Warning: object not found' })
  })
    .catch(error => {
      console.log(error)
      res.status(500).json({ message: `Internal Server Error: ${error}` })
    })
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve('dist/index.html'))
})

let db
MongoClient.connect('mongodb://localhost/bookmarks')
  .then(connection => {
    db = connection
    app.listen(3000, () => {
      console.log('App started on port 3000')
    })
  })
  .catch(error => {
    console.log('ERROR: ', error)
  })
