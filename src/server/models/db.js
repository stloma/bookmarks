import session from 'express-session'
import { MongoClient, ObjectId } from 'mongodb'
import connectMongo from 'connect-mongodb-session'
import { countBy } from 'lodash'
import download from '../scripts/favicon'

const MongoDBStore = connectMongo(session)

const store = new MongoDBStore(
  {
    uri: 'mongodb://localhost/bookmarkapp',
    collection: 'sessions'
  })

store.on('error', (error) => {
  if (error) throw error
})

const db = {}

MongoClient.connect('mongodb://localhost/bookmarkapp')
  .then((connection) => {
    db.bookmarkDb = connection
  })
  .catch((error) => {
    console.log(`Mongo connect error: ${error}`)
  })

async function getBookmarks(userDb) {
  try {
    // Get user bookmarks
    const bookmarks = await db.bookmarkDb.collection(`bookmarks.${userDb}`).find().toArray()

    // Tally up tag counts for tagcloud
    const result = countBy(bookmarks.map(bookmark => bookmark.tags).join(' ').split(' '))

    const tagcount = Object.keys(result).map(tag => ({ value: tag, count: result[tag] }))
      .filter(name => name.value !== '')

    return ({ tagcount, records: bookmarks })
  } catch (error) { throw Error(error) }
}

async function discover(userDb) {
  try {
    // Get all collections
    const collections = await db.bookmarkDb.listCollections().toArray()

    // Filter out all bookmark collections that don't belong to the current user
    const ids = collections.filter(
      collection => collection.name.startsWith('bookmarks') && !collection.name.endsWith(userDb)
    )

    // Get an array of promises
    const promises = ids.map(id => db.bookmarkDb.collection(id.name).find().toArray())

    // Resolve all promises
    const result = await Promise.all(promises)

    // Create one array from the array of users' bookmarks
    const allBookmarks = [].concat(...result)

    // Count tags for tagcloud
    const counts = countBy(allBookmarks.map(bookmark => bookmark.tags).join(' ').split(' '))
    const tagcount = Object.keys(counts).map(tag => ({ value: tag, count: result[tag] }))
      .filter(name => name.value !== '')

    return { tagcount, records: allBookmarks }
  } catch (error) { throw Error(error) }
}

async function addBookmark(userDb, bookmark) {
  try {
    const newBookmark = bookmark
    const userId = userDb.split('.')[1]

    const res = await db.bookmarkDb.collection(userDb).insertOne(newBookmark)

    // if this is a new bookmark, download favicon and add createdby property
    if (!newBookmark.favicon) {
      // Download favicon
      const _id = new ObjectId(res.insertedId)
      const result = await download(newBookmark.url, _id)

      // If the fetch result of the favicon was not 200, use the default image
      newBookmark.favicon = result === 200 ? `${_id}.ico` : 'default-favicon.png'

      // Add created by property to bookmarks for /discover
      const name = await db.bookmarkDb.collection('users').findOne({ _id: new ObjectId(userId) }, { _id: 0, username: 1 })
      newBookmark.createdBy = name.username
      await db.bookmarkDb.collection(userDb).updateOne(
        { _id },
        { $set: { favicon: newBookmark.favicon, createdBy: newBookmark.createdBy } }
      )
    }
  } catch (error) { throw Error(error) }
}

async function deleteBookmark(userDb, _id) {
  const result = await db.bookmarkDb.collection(userDb).deleteOne({ _id })

  // If bookmark doesn't exist, return 404
  const error = result.result.n === 1 ? null : 404

  if (error) throw new Error(error)

  return result
}

async function editBookmark(userDb, site) {
  const bookmarkId = new ObjectId(site._id)

  try {
    await db.bookmarkDb.collection(userDb).updateOne(
      { _id: bookmarkId },
      { $set: {
        name: site.name,
        url: site.url,
        comment: site.comment,
        tags: site.tags,
        update: site.updated
      } }
    )
  } catch (error) { throw Error(error) }
}

export { discover, db, store, addBookmark, getBookmarks, deleteBookmark, editBookmark }
