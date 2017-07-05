import express from 'express'
import passport from 'passport'

import { CreateUser, validateRegistration } from '../models/user.js'
import { ensureAuthenticated } from '../auth/passport.js'
import { bookmarkDb } from '../models/db.js'

const router = express.Router()

router.get('/logout', ensureAuthenticated, function (req, res) {
  req.session.destroy()
  req.logout()
})

router.post('/login', passport.authenticate('local'), function (req, res) {
  res.status(200).json({ name: res.req.user.name })
})

router.post('/registeruser', (req, res) => {
  let newUser = req.body
  newUser.created = new Date().getTime()

  const errors = validateRegistration(newUser)
  if (errors) {
    res.status(400).json(errors)
    return
  }

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

export { router }
