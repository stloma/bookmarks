'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateRegistration = exports.CreateUser = exports.ComparePassword = undefined;

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _db = require('./db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ComparePassword = exports.ComparePassword = async function ComparePassword(candidatePassword, hash) {
  try {
    var isMatch = await _bcrypt2.default.compare(candidatePassword, hash);
    return isMatch;
  } catch (error) {
    throw Error(error);
  }
};

var CreateUser = exports.CreateUser = async function CreateUser(user) {
  var newUser = user;
  try {
    var passHash = await _bcrypt2.default.hash(newUser.password, 10);
    newUser.password = passHash;
    return await _db.db.bookmarkDb.collection('users').insertOne(newUser);
  } catch (error) {
    throw Error(error);
  }
};

var registerFieldType = {
  username: 'required',
  password: 'required',
  created: 'required'
};

function validateRegistration(site) {
  var errors = [];
  var emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
  Object.keys(registerFieldType).forEach(function (field) {
    var type = registerFieldType[field];
    if (type === 'required' && !site[field]) {
      errors.push(field + ' is required');
    }
  });
  var email = site.email;
  if (email && !email.match(emailPattern)) {
    errors.push('Please enter a valid email address');
  }
  if (errors.length > 0) {
    return errors;
  }
  return null;
}

exports.validateRegistration = validateRegistration;
//# sourceMappingURL=user.js.map