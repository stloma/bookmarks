
const siteFieldType = {
  name: 'required',
  url: 'required',
  created: 'required',
  author: 'optional',
  tags: 'optional',
  comment: 'optional'
}

const editFieldType = {
  name: 'required',
  url: 'required',
  updated: 'required',
  author: 'optional',
  tags: 'optional',
  comment: 'optional'
}

function validUrl (url) {
  const urlPattern = /^(https?:\/\/){1}[^-][a-z0-9.-]+[^-]\.[a-z]{2,4}$/
  if (url.match(urlPattern)) {
    return true
  }
  return false
}

function validateSite (site) {
  let errors = []
  for (const field in siteFieldType) {
    const type = siteFieldType[field]
    if (type === 'required' && !site[field]) {
      errors.push(`${field} is required`)
    }
  }
  let url = site['url']
  if (url && !validUrl(url)) {
    errors.push('Please enter a valid url. E.g., http://www.example.com')
  }
  if (errors.length > 0) {
    return errors
  } else {
    return null
  }
}

function validateEdit (site) {
  let errors = []
  for (const field in editFieldType) {
    const type = editFieldType[field]
    if (type === 'required' && !site[field]) {
      errors.push(`${field} is required`)
    }
  }
  let url = site['url']
  if (url && !validUrl(url)) {
    errors.push('Please enter a valid url. E.g., http://www.example.com')
  }
  if (errors.length > 0) {
    return errors
  } else {
    return null
  }
}

export { validateSite, validateEdit }
