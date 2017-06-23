import { MongoClient, ObjectId } from 'mongodb'
import Bookmark from './bookmark.js'

import connectMongo from 'connect-mongodb-session'
const MongoDBStore = connectMongo(session)

const store = new MongoDBStore(
  {
    uri: 'mongodb://localhost/bookmarkapp',
    collection: 'sessions'
  })

store.on('error', function (error) {
  if (error) throw error
})

export let bookmarkDb

MongoClient.connect('mongodb://localhost/bookmarkapp')
  .then(connection => {
    bookmarkDb = connection
  })
  .catch(error => {
    console.log('ERROR: ', error)
  })
