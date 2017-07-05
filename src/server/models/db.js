import session from 'express-session'
import { MongoClient } from 'mongodb'
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

let bookmarkDb

MongoClient.connect('mongodb://localhost/bookmarkapp')
  .then(connection => {
    bookmarkDb = connection
  })
  .catch(error => {
    console.log('ERROR: ', error)
  })

export { bookmarkDb, store }
