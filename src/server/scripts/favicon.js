import rp from 'request-promise'
import path from 'path'
import fs from 'fs-extra'

export default function download(url, id) {
  let address = url.match(/^(https?:\/\/){1}[^-][a-z0-9.-]+[^-]\.[a-z]{2,4}/)
  if (address) {
    address = address[0]
  }
  const options = {
    uri: `${address}/favicon.ico`,
    encoding: null,
    followRedirect: true,
    timeout: 5000,
    maxRedirect: 5
  }

  return rp(options)
    .then(result => fs.outputFile(path.join(__dirname, `../../../dist/images/favicons/${id}.ico`), result))
    .then(() => 200)
    .catch(error => error)
}
