
const siteFieldType = {
  name: 'required',
  url: 'required',
  created: 'required',
  author: 'optional',
  tags: 'optional',
  comment: 'optional'
};

const editFieldType = {
  name: 'required',
  url: 'required',
  updated: 'required',
  author: 'optional',
  tags: 'optional',
  comment: 'optional'
};

function validUrl(url) {
  return url.match(/^(https?:\/\/){1}[^-][a-z0-9.-]+[^-]\.[a-z]{2,4}$/);
}

function validateBookmark(site) {
  const errors = [];
  Object.keys(siteFieldType).forEach(field => {
    const type = siteFieldType[field];
    if (type === 'required' && !site[field]) {
      errors.push(`${field} is required`);
    }
  });
  const url = site.url;
  if (url && !validUrl(url)) {
    errors.push('Please enter a valid url. E.g., http://www.example.com');
  }
  if (errors.length > 0) {
    return errors;
  }
  return null;
}

function validateEdit(site) {
  const errors = [];
  Object.keys(editFieldType).forEach(field => {
    const type = editFieldType[field];
    if (type === 'required' && !site[field]) {
      errors.push(`${field} is required`);
    }
  });
  const url = site.url;
  if (url && !validUrl(url)) {
    errors.push('Please enter a valid url. E.g., http://www.example.com');
  }
  if (errors.length > 0) {
    return errors;
  }
  return null;
}

export { validateBookmark, validateEdit };
//# sourceMappingURL=bookmark.js.map