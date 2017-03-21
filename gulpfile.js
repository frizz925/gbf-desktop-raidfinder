const gulp = require("gulp");
const gutil = require("gulp-util");
const notify = require("gulp-notify");
const babel = require("gulp-babel");
const sass = require("gulp-sass");
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
  };
};

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

gulp.task("sass", function() {
  return gulp.src("src/scss/**/*.scss")
    .pipe(sass().on("error", (err) => {
      notify("Sass build error!");
      console.error(err);
    }))
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
});

gulp.task("sass:watch", function() {
  gulp.watch("src/scss/**/*.scss", ["sass"]);
});

gulp.task("build:js", ["babel", "webpack"]);
gulp.task("build:css", ["sass"]);

gulp.task("build", ["build:js", "build:css"]);
gulp.task("watch", ["babel:watch", "webpack:watch", "sass:watch"], function() {});
gulp.task("default", ["build"]);

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