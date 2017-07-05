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

const registerFieldType = {
  name: 'required',
  username: 'required',
  email: 'required',
  password: 'required',
  created: 'required'
}

function validateRegistration (site) {
  let errors = []
  for (const field in registerFieldType) {
    const type = registerFieldType[field]
    if (type === 'required' && !site[field]) {
      errors.push(`${field} is required`)
    }
  }
  if (errors.length > 0) {
    return errors
  } else {
    return null
  }
}

export { validateRegistration }
