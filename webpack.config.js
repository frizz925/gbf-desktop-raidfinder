var path = require("path");
var webpack = require("webpack");

module.exports = {
  devtool: "eval",
  entry: "./dist/ui/index",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    modules: [
      path.join(__dirname, "dist"),
      path.join(__dirname, "node_modules")
    ]
  }
};