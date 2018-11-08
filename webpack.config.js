const path = require("path")
const webpack = require("webpack")

const isDev = process.env.NODE_ENV !== "production"

module.exports = {
  target: 'webworker',
  node: {
    global: false
  },
  performance: {
    hints: false
  },
  entry: {
    index: "./src/index.js",
    worker: "./workers/worker.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build"),
  },
  module: {
    rules: [{
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /(node_modules)/,
        options: {
          compact: false,
        },
      },
      {
        test: /\.css$/,
        use: [{
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
            },
          },
          "extract-loader",
          "css-loader",
        ],
      },
    ],
  },
}
