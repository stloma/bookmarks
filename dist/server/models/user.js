function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import bcrypt from 'bcrypt';
import { db } from './db';

export const ComparePassword = (() => {
  var _ref = _asyncToGenerator(function* (candidatePassword, hash) {
    try {
      const isMatch = yield bcrypt.compare(candidatePassword, hash);
      return isMatch;
    } catch (error) {
      throw Error(error);
    }
  });

  return function ComparePassword(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

export const CreateUser = (() => {
  var _ref2 = _asyncToGenerator(function* (user) {
    const newUser = user;
    try {
      const passHash = yield bcrypt.hash(newUser.password, 10);
      newUser.password = passHash;
      return yield db.bookmarkDb.collection('users').insertOne(newUser);
    } catch (error) {
      throw Error(error);
    }
  });

  return function CreateUser(_x3) {
    return _ref2.apply(this, arguments);
  };
})();

const registerFieldType = {
  username: 'required',
  password: 'required',
  created: 'required'
};

function validateRegistration(site) {
  const errors = [];
  const emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
  Object.keys(registerFieldType).forEach(field => {
    const type = registerFieldType[field];
    if (type === 'required' && !site[field]) {
      errors.push(`${field} is required`);
    }
  });
  const email = site.email;
  if (email && !email.match(emailPattern)) {
    errors.push('Please enter a valid email address');
  }
  if (errors.length > 0) {
    return errors;
  }
  return null;
}

export { validateRegistration };
//# sourceMappingURL=user.js.map