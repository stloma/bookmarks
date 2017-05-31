var WebpackDevServer = require('webpack-dev-server')
var webpack = require('webpack')
var config = require('./webpack.config.js')
// var path = require('path')

/*
const webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')
*/

var compiler = webpack(config)
var server = new WebpackDevServer(compiler, {
  hot: true,
  historyApiFallback: true,
  filename: config.output.filename,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
})
server.listen(8080, 'localhost', function () {})