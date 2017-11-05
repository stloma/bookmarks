const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    app: ['babel-polyfill', './src/client/jsx/Router.jsx'],
    vendor: ['react', 'react-dom', 'react-router', 'react-bootstrap', 'react-router-bootstrap']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/app.bundle.js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'js/vendor.bundle.js' })
  ],
  devServer: {
    port: 8000,
    contentBase: path.join(__dirname, './dist'),
    proxy: {
      '/api/*': {
        target: 'http://127.0.0.1:3000'
      }
    },
    historyApiFallback: true,
    disableHostCheck: true
  },
  stats: {
    colors: true,
    reasons: true,
    chunks: true
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders: [
      {
        enforce: 'pre',
        test: /\.jsx$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-2']
        }
      }
    ]
  }
};
