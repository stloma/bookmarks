import express from 'express'
import { ObjectId } from 'mongodb'
import { countBy } from 'lodash'

import { download } from '../scripts/favicon.js'
import { ensureAuthenticated } from '../auth/passport.js'
import { bookmarkDb } from '../models/db.js'
import { validateSite, validateEdit } from '../models/bookmark.js'

const router = express.Router()

router.get('/protected', ensureAuthenticated, (req, res) => {
  console.log(res)
  res.status(200).json({ name: res.req.user.name })
})

router.get('/bookmarks', ensureAuthenticated, (req, res) => {
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
      const metadata = { total_count: bookmarks.length }
      res.json({ _metadata: metadata, tagcount: tagcount, records: bookmarks })
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ message: `Internal Server Error: ${error}` })
    })
})

router.post('/bookmarks', ensureAuthenticated, (req, res) => {
  let userDb = req.session.passport.user
  const newSite = req.body
  newSite.created = new Date().getTime()
  const errors = validateSite(newSite)
  if (errors) {
    res.status(400).json(errors)
    console.log('errors: ' + errors)
    return
  }

  bookmarkDb.collection('bookmarks.' + userDb).insertOne(newSite)
    .then(result => {
      bookmarkDb.collection('bookmarks.' + userDb).find({ _id: result.insertedId }).limit(1).next()
    }).then(newSite => {
      res.json(newSite)
    }).catch(error => {
      console.log(error)
      res.status(500).json({ message: `Internal Server Error: ${error}` })
    })

  download(newSite.url, newSite._id, function (success) {
    if (success) {
      newSite.favicon = newSite._id + '.ico'
    } else {
      newSite.favicon = 'default-favicon.png'
    }
    let bookmarkId = new ObjectId(newSite._id)
    bookmarkDb.collection('bookmarks.' + userDb).updateOne({ _id: bookmarkId },
      {$set: {
        favicon: newSite.favicon
      }})
        .catch(error => {
          throw error
        })
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

  bookmarkDb.collection('bookmarks.' + userDb).deleteOne({ _id: bookmarkId }).then((deleteResult) => {
    if (deleteResult.result.n === 1) res.json({ status: 'OK' })
    else res.json({ status: 'Warning: object not found' })
  })
    .catch(error => {
      console.log(error)
      res.status(500).json({ message: `Internal Server Error: ${error}` })
    })
})

router.patch('/bookmarks', ensureAuthenticated, (req, res) => {
  let userDb = req.session.passport.user
  const site = req.body
  site.updated = new Date().getTime()

  const err = validateEdit(site)
  if (err) {
    res.status(422).json({ message: `Invalid request: ${err}` })
    return
  }

  let bookmarkId = new ObjectId(site._id)
  bookmarkDb.collection('bookmarks.' + userDb).updateOne({ _id: bookmarkId }, {
    $set: {
      name: site.name,
      url: site.url,
      comment: site.comment,
      tags: site.tags,
      update: site.updated
    }})
    .catch(error => {
      throw error
    })
})

export { router }
