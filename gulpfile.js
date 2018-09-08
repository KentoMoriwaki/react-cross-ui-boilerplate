const fs = require("fs");
const path = require("path");

const gulp = require("gulp");
const gutil = require("gulp-util");
const cached = require("gulp-cached");
const babel = require("gulp-babel");
const del = require("del");
const eol = require("gulp-eol");
const runSequence = require("run-sequence");

const src = path.resolve(
  __dirname,
  "packages/react-cross-ui-boilerplate/src/index.jsx"
);

const dist = path.resolve(
  __dirname,
  "packages/react-cross-ui-boilerplate/dist"
);

gulp.task("babel", () =>
  gulp
    .src(src)
    .pipe(
      babel({
        presets: ["@babel/env", "@babel/react", "@babel/typescript"]
      })
    )
    .pipe(gulp.dest(dist))
);

gulp.task("build", callback => {
  runSequence(["babel"], callback);
});
