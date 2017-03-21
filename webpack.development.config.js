var path = require("path");
var webpack = require("webpack");

module.exports = {
  devtool: "eval",
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
  }
};