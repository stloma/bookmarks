import express from 'express'
import { ObjectId } from 'mongodb'

import { ensureAuthenticated } from '../auth/passport.js'
import { addSite, getBookmarks, deleteSite, editSite } from '../models/db.js'
import { validateSite, validateEdit } from '../models/bookmark.js'

const router = express.Router()

router.get('/protected', ensureAuthenticated, (req, res) => {
  res.status(200).json({ name: res.req.user.name })
})

router.get('/bookmarks', ensureAuthenticated, (req, res) => {
  let userDb = req.session.passport.user

  getBookmarks(userDb, function (error, result) {
    if (error) {
      res.status(500).json({ message: `Internal Server Error: ${error}` })
      throw error
    }
    res.json(result)
  })
})

router.post('/bookmarks', ensureAuthenticated, (req, res) => {
  let userDb = req.session.passport.user
  const newSite = req.body
  newSite.created = new Date().getTime()
  const errors = validateSite(newSite)
  if (errors) {
    res.status(400).json(errors)
    return
  }

  addSite('bookmarks.' + userDb, newSite, function (error, result) {
    if (error) {
      res.status(500).json({ message: `Internal Server Error: ${error}` })
    }
    res.status(200).send('1 record inserted')
  })
})

router.delete('/bookmarks/:id', ensureAuthenticated, (req, res) => {
  let userDb = req.session.passport.user
  let bookmarkId
  try {
    bookmarkId = new ObjectId(req.params.id)
  } catch (error) {
    res.status(422).json({ message: `Invalid issue ID format: ${error}` })
    return
  }

  deleteSite('bookmarks.' + userDb, bookmarkId, function (error, result) {
    if (error) {
      if (error === '404') {
        res.status(404).json({ message: 'Delete object not found' })
        return
      }
      res.status(500).json({ message: `Internal Server Error: ${error}` })
      return
    } res.status(200).json({ message: 'Successfully deleted object' })
  })
})

router.patch('/bookmarks', ensureAuthenticated, (req, res) => {
  let userDb = req.session.passport.user
  const site = req.body
  site.updated = new Date().getTime()

  const errors = validateEdit(site)
  if (errors) {
    res.status(422).json(errors)
    return
  }

  editSite('bookmarks.' + userDb, site, function (error, result) {
    if (error) throw error
    res.status(200).json('Edit site success')
  })
})

export { router }