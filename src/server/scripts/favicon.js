import request from 'request'
import path from 'path'
import fs from 'fs'

const options = {
  encoding: null,
  timeout: 5000,
  followRedirect: true,
  maxRedirect: 5
}

export const download = function (uri, id, callback) {
  request({
    url: 'https://www.' + uri + '/favicon.ico',
    encoding: null,
    followRedirect: true,
    timeout: 5000,
    maxRedirect: 5
  }, function (err, res, body) {
    if (err) {
      callback(false)
    } else if (res.statusCode === 200) {
      fs.writeFile(path.join(__dirname, '../../../dist/images/') + id + '.ico', body, function (err) {
        if (err) throw err
      })
      callback(true)
    } else {
      callback(false)
    }
  })
}
