import passport from 'passport'
import { CreateUser, ComparePassword } from './models/user.js'

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(function (user, done) {
  done(null, user._id)
})

passport.deserializeUser(function (user, done) {
  console.log('deserializing')
  done(null, user)
})

passport.use(new LocalStrategy(
  function (username, password, done) {
    userDb.collection('users').findOne({ username: username })
      .then(user => {
        if (!user) {
          console.log(user + ' not found')
          return done(null, false, { message: 'Incorrect username.' })
        }
        if (user.password !== password) {
          console.log(password + ': bad password')
          return done(null, false, { message: 'Incorrect password.' })
        }
        return done(null, user)
      })
  })
)

let userDb

MongoClient.connect('mongodb://localhost/loginapp')
  .then(connection => {
    userDb = connection
  })
  .catch(error => {
    console.log('ERROR: ', error)
  })

app.get('/api/logout', ensureAuthenticated, function (req, res) {
  req.logout()
})

app.post('/api/login', passport.authenticate('local'), function (req, res) {
  res.redirect('/')
})

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.status(401).send('Please login to perform this operation')
  }
}
