import session from 'express-session'
import { MongoClient, ObjectId } from 'mongodb'
import connectMongo from 'connect-mongodb-session'
import { countBy } from 'lodash'
import { download } from '../scripts/favicon.js'

const MongoDBStore = connectMongo(session)

const store = new MongoDBStore(
  {
    uri: 'mongodb://localhost/bookmarkapp',
    collection: 'sessions'
  })

store.on('error', function (error) {
  if (error) throw error
})

let bookmarkDb

MongoClient.connect('mongodb://localhost/bookmarkapp')
  .then(connection => {
    bookmarkDb = connection
  })
  .catch(error => {
    console.log('ERROR: ', error)
  })

function getBookmarks (userDb, cb) {
  bookmarkDb.collection('bookmarks.' + userDb).find().toArray()
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
      cb(null, { _metadata: metadata, tagcount: tagcount, records: bookmarks })
    })
    .catch(error => {
      cb(error)
    })
}

function addSite (bmarkDb, newSite, cb) {
  bookmarkDb.collection(bmarkDb).insertOne(newSite, function (error, res) {
    let _id = res.insertedId

    download(newSite.url, _id, function (error, result) {
      if (error) {
        cb(error)
        return
      }
      console.log(result)
      newSite.favicon = result === 200 ? _id + '.ico' : 'default-favicon.png'
      console.log(newSite.favicon)
      let bookmarkId = new ObjectId(_id)
      bookmarkDb.collection(bmarkDb).updateOne({ _id: bookmarkId },
        {$set: {
          favicon: newSite.favicon
        }})
          .catch(error => {
            throw error
          })
    })
    cb(error, res)
  })
}

function deleteSite (bmarkDb, _id, cb) {
  bookmarkDb.collection(bmarkDb).deleteOne({ _id: _id }).then((result) => {
    let error = result.result.n === 1 ? null : '404'
    cb(error)
  })
  .catch(error => {
    cb(error)
  })
}

function editSite (bmarkDb, site, cb) {
  let bookmarkId = new ObjectId(site._id)
  bookmarkDb.collection(bmarkDb).updateOne({ _id: bookmarkId }, {
    $set: {
      name: site.name,
      url: site.url,
      comment: site.comment,
      tags: site.tags,
      update: site.updated
    }}, function (error, result) {
      if (error) {
        cb(error)
      } else {
        cb(null, result)
      }
    })
}

export { bookmarkDb, store, addSite, getBookmarks, deleteSite, editSite }
