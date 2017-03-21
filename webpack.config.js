
module.exports = process.env.NODE_ENV === "production"
  ? require("./webpack.production.config")
  : require("./webpack.development.config");