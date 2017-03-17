const gulp = require("gulp");
const gutil = require("gulp-util");
const notify = require("gulp-notify");
const babel = require("gulp-babel");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config");
const browserSync = require("browser-sync");

const webpackCallback = function(cb, bs) {
  var done = false;
  return function(err, stats) {
    if (err) {
      notify("Webpack task failed!");
      throw new gutil.PluginError("[webpack]", err);
    }

    gutil.log("[webpack]", stats.toString());

    if (bs) {
      notify("Reloading browsers...");
      bs.reload();
    }

    if (!done) {
      done = true;
      cb();
    }
  }
}

gulp.task("default", ["build"]);

gulp.task("build", ["babel", "webpack"]);

gulp.task("webpack", function(cb) {
  webpack(webpackConfig, webpackCallback(cb));
});

gulp.task("webpack:watch", function(cb) {
  var config = Object.assign({}, webpackConfig, {
    watch: true
  });
  webpack(config, webpackCallback(cb, browserSync));
});

gulp.task("babel", function() {
  return gulp.src("src/**/*.{js,jsx}")
    .pipe(babel().on("error", (err) => {
      notify("Babel build error!");
      console.error(err);
    }))
    .pipe(gulp.dest("dist"));
});

gulp.task("babel:watch", function() {
  gulp.watch("src/**/*.{js,jsx}", ["babel"]);
});

gulp.task("watch", ["babel:watch", "webpack:watch"]);

gulp.task("serve", ["watch"], function() {
  browserSync.init({
    host: "0.0.0.0",
    port: 3000,
    server: {
      baseDir: "."
    },
    open: false
  });
});