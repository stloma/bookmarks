'use strict'

const siteFieldType = {
  name: 'required',
  url: 'required',
  created: 'required',
  author: 'optional',
  private: 'optional',
  tags: 'optional'
}

function validateSite (site) {
  for (const field in siteFieldType) {
    const type = siteFieldType[field]
    if (!type) {
      delete site[field]
    } else if (type === 'required' && !site[field]) {
      return `${field} is required.`
    }
  }

  return null
}

module.exports = {
  validateSite: validateSite
}
