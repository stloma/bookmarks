import rp from 'request-promise'
import path from 'path'
import fs from 'fs-extra'

export function download (url, id) {
  const options = {
    uri: `${url}/favicon.ico`,
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

    /*
  return rp(options)
    .then(result => {
      return Promise.all([
        result,
        fs.outputFile(path.join(__dirname, `../../../dist/images/favicons/${id}.ico`), result)
      ])
    })
    .then(result => result)
    .catch(error => console.log(error))
}
*/
      /*
  request({
    url: url + '/favicon.ico',
    encoding: null,
    followRedirect: true,
    timeout: 5000,
    maxRedirect: 5
  }, function (err, res, body) {
    if (err) {
      callback(err)
    } else if (res.statusCode === 200) {
      fs.writeFile(
        path.join(__dirname, `../../../dist/images/favicons/${id}.ico`), body, function (err) {
          if (err) {
            callback(err)
          }
          callback(null, res.statusCode)
        })
    } else {
      callback(null, res.statusCode)
    }
  })
  */
