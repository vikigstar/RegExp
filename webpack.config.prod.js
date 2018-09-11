const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const path = require('path')
const webpack = require('webpack')

module.exports = {
  target: 'webworker',
  performance: {
    hints: false
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src/'),
      '@app': path.resolve(__dirname, 'src/app/'),
      '@worker': path.resolve(__dirname, 'src/worker/')
    }
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  }
};
