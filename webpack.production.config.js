var path = require("path");
var webpack = require("webpack");
var UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  devtool: "cheap-module-source-map",
  entry: "./src/ui/index.jsx",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ["babel-loader"],
      include: path.join(__dirname, "src"),
      exclude: path.join(__dirname, "node_modules")
    }]
  },
  resolve: {
    modules: [
      path.join(__dirname, "src"),
      path.join(__dirname, "node_modules")
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("production")
      }
    }),
    new UglifyJsPlugin()
  ]
};