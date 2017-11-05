const webpack = require('webpack');
const path = require('path');
const MinifyPlugin = require("babel-minify-webpack-plugin");

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
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'js/vendor.bundle.js' }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      parallel: true,
      uglifyOptions: {
        ie8: false,
        mangle: {
          screw_ie8: true,
          keep_fnames: true
        }
      },
      compress: {
        screw_ie8: true,
        warnings: false
      },
      output: {
        beautify: false,
        comments: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],
  /* devtool: 'source-map', */
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-2'],
        }
      }
    ]
  }
};
