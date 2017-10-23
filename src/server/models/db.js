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

function discover (userDb, cb) {
  let allBookmarks = []
  let promises = []
  //
  // Get all collections
  bookmarkDb.listCollections().toArray(function (e, collections) {
    //
    // Filter out all bookmark collections that don't belong to the current user
    let ids = collections.filter(
      collection => collection.name.startsWith('bookmarks') && !collection.name.endsWith(userDb)
    )
    ids.forEach(id => {
        /*
      let userId = id.name.split('.')[1]
      bookmarkDb.collection('users').findOne({ _id: new ObjectId(userId) }, { _id: 0, name: 1 })
        .then(name => console.log(name.name))
        */
      promises.push(bookmarkDb.collection(id.name).find().toArray()
        .then(bookmarks => {
          allBookmarks = [...bookmarks, ...allBookmarks]
          return allBookmarks
        })
      )
    })
    Promise.all(promises).then(() => {
      let result = countBy(allBookmarks.map(function (bookmark) {
        return bookmark.tags
      })
         .join(' ')
        .split(' ')
      )
      let tagcount = []
      Object.keys(result).forEach((tag) => {
        tagcount.push({ value: tag, count: result[tag] })
      })
      const metadata = { total_count: allBookmarks.length }
      cb(null, { _metadata: metadata, tagcount: tagcount, records: allBookmarks })
    })
    .catch(error => {
      cb(error)
    })
  })
}

async function addBookmark (userDb, newBookmark, cb) {
  const userId = userDb.split('.')[1]

  let res = await bookmarkDb.collection(userDb).insertOne(newBookmark)
  let _id = new ObjectId(res.insertedId)

  try {
  // if this is a new bookmark download favicon and add createdby property
    if (!newBookmark.favicon) {
      const result = await download(newBookmark.url, _id)
      console.log(result)
      newBookmark.favicon = result === 200 ? `${_id}.ico` : 'default-favicon.png'
      const name = await bookmarkDb.collection('users').findOne({ _id: new ObjectId(userId) }, { _id: 0, username: 1 })
      newBookmark.createdBy = name.username
      await bookmarkDb.collection(userDb).updateOne(
        { _id: _id },
        { $set: { favicon: newBookmark.favicon, createdBy: newBookmark.createdBy } }
      )
    }
  } catch (error) { console.log(`Failed creating bookmark: ${error}`); cb(error) }
  cb(null)
}

function deleteBookmark (userDb, _id, cb) {
  bookmarkDb.collection(userDb).deleteOne({ _id: _id }).then((result) => {
    let error = result.result.n === 1 ? null : '404'
    cb(error)
  })
  .catch(error => {
    cb(error)
  })
}

function editBookmark (userDb, site, cb) {
  let bookmarkId = new ObjectId(site._id)
  bookmarkDb.collection(userDb).updateOne({ _id: bookmarkId }, {
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

export { discover, bookmarkDb, store, addBookmark, getBookmarks, deleteBookmark, editBookmark }
