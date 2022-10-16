const gulp = require("gulp");
const concat = require("gulp-concat");
const GulpUglify = require("gulp-uglify");

const build = (c) => {
  gulp
    .src("./src/*.js")
    .pipe(concat("min.js"))
    .pipe(GulpUglify())
    .pipe(gulp.dest("./build"));
  c();
};

exports.build = build;
