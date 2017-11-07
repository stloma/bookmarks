'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var siteFieldType = {
  name: 'required',
  url: 'required',
  created: 'required',
  author: 'optional',
  tags: 'optional',
  comment: 'optional'
};

var editFieldType = {
  name: 'required',
  url: 'required',
  updated: 'required',
  author: 'optional',
  tags: 'optional',
  comment: 'optional'
};

function validUrl(url) {
  return url.match(/^(https?:\/\/){1}[^-][a-z0-9.-]+[^-]\.[a-z]{2,4}/);
}

function validateBookmark(site) {
  var errors = [];
  Object.keys(siteFieldType).forEach(function (field) {
    var type = siteFieldType[field];
    if (type === 'required' && !site[field]) {
      errors.push(field + ' is required');
    }
  });
  var url = site.url;
  if (url && !validUrl(url)) {
    errors.push('Please enter a valid url. E.g., example.com');
  }
  if (errors.length > 0) {
    return errors;
  }
  return null;
}

function validateEdit(site) {
  var errors = [];
  Object.keys(editFieldType).forEach(function (field) {
    var type = editFieldType[field];
    if (type === 'required' && !site[field]) {
      errors.push(field + ' is required');
    }
  });
  var url = site.url;
  if (url && !validUrl(url)) {
    errors.push('Please enter a valid url. E.g., http://www.example.com');
  }
  if (errors.length > 0) {
    return errors;
  }
  return null;
}

exports.validateBookmark = validateBookmark;
exports.validateEdit = validateEdit;
//# sourceMappingURL=bookmark.js.map