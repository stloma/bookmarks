
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

function validateSite (site) {
  let errors = []
  for (const field in siteFieldType) {
    const type = siteFieldType[field]
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

function validateEdit (site) {
  let errors = []
  for (const field in editFieldType) {
    const type = editFieldType[field]
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

export { validateSite, validateEdit }
