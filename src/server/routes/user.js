import express from 'express'
import { CreateUser, ComparePassword } from './models/user.js'
import passport from 'passport'

const LocalStrategy = require('passport-local').Strategy
export const router = express.Router()

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

router.get('/api/logout', ensureAuthenticated, function (req, res) {
  req.session.destroy()
  req.logout()
})

router.post('/api/login', passport.authenticate('local'), function (req, res) {
  res.redirect('/')
})

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.status(401).send('Please login to perform this operation')
  }
}

router.post('/api/registeruser', (req, res) => {
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

router.get('/userroute', (req, res) => {
  res.send('user route')
})

