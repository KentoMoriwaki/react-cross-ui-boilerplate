const fs = require("fs");
const path = require("path");

const eventStream = require("event-stream");
const gulp = require("gulp");
const gutil = require("gulp-util");
const argv = require("yargs").argv;
const cached = require("gulp-cached");
const babel = require("gulp-babel");
const del = require("del");
const eol = require("gulp-eol");
const shell = require("gulp-shell");
const runSequence = require("run-sequence");

const getBuildConfig = require("./buildconfig");
const babelrc = require("./.babelrc");

const config = getBuildConfig("ios");

function handleError(err) {
  console.log(err.toString());
}

function normalizePath(path) {
  return path
    .replace(/^(?!\.(?:\/|\\))/, "./") // add ./ at beginning if not present
    .replace(/\\/g, "/"); // change path separators
}

function aliasify(aliases) {
  var reqPattern = new RegExp(/require\(['"]([^'"]+)['"]\)/g); // matches requires

  return eventStream
    .map((file, done) => {
      if (!file.isNull()) {
        const content = file.contents.toString();
        if (reqPattern.test(content)) {
          file.contents = Buffer.from(
            content.replace(reqPattern, (req, oldPath) => {
              console.log(oldPath);
              if (!aliases[oldPath]) {
                return req;
              }
              if (aliases[oldPath][0] === ".") {
                const oldFolder = path.dirname(path.resolve(file.path));
                const targetFile = path.resolve(aliases[oldPath]);
                const newPath = path.resolve(oldFolder, targetFile);

                return `require("${normalizePath(newPath)}")`;
              } else {
                return `require("${normalizePath(aliases[oldPath])}")`;
              }
            })
          );
        }
      }
      done(null, file);
    })
    .on("error", handleError);
}

const src = path.resolve(__dirname, "src/**/*");

const dist = path.resolve(__dirname, "dist");

gulp.task("babel", () =>
  gulp
    .src(src)
    .pipe(babel(babelrc))
    .on("error", handleError)
    // .pipe(aliasify(config.aliases))
    .pipe(gulp.dest(dist))
    .on("error", handleError)
);

// gulp.task("build", callback => {
//   runSequence(["babel"], callback);
// });

// Handle args
const platform = argv.platform || "web";
gutil.log(gutil.colors.yellow(`platform: ${platform}`));

gulp.task(
  "build",
  shell.task(`node_modules/.bin/webpack --env.platform=${platform}`)
);

gulp.task(
  "watch",
  shell.task(`node_modules/.bin/webpack --watch --env.platform=${platform}`)
);
