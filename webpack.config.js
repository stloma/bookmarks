var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: [
    './src/Main.js',
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://127.0.0.1:8080'
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.join(__dirname, 'src'),
        query: {
          presets: ['es2015', 'react']
        },
        exclude: /node_modules/
      }
    ]
  }
}
