import bcrypt from 'bcrypt'

export const ComparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
    if (err) throw err
    callback(isMatch)
  })
}

export const CreateUser = (newUser, callback) => {
  bcrypt.genSalt(10, function (err, salt) {
    if (err) throw err
    bcrypt.hash(newUser.password, salt, function (err, hash) {
      if (err) throw err
      newUser.password = hash
      callback(newUser)
    })
  })
}
