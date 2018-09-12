const fs = require("fs");
const path = require("path");

const eventStream = require("event-stream");
const gulp = require("gulp");
const gutil = require("gulp-util");
const argv = require("yargs").argv;
const cached = require("gulp-cached");
const babel = require("gulp-babel");
const ts = require("gulp-typescript");
const typescript = require("typescript");
const del = require("del");
const eol = require("gulp-eol");
const shell = require("gulp-shell");
const watch = require("gulp-watch");
const runSequence = require("run-sequence");

const getBuildConfig = require("./buildconfig");
const babelrc = require("./.babelrc");

// const config = getBuildConfig("ios");

function handleError(err) {
  console.log(err);
}

// function normalizePath(path) {
//   return path
//     .replace(/^(?!\.(?:\/|\\))/, "./") // add ./ at beginning if not present
//     .replace(/\\/g, "/"); // change path separators
// }

// function aliasify(aliases) {
//   var reqPattern = new RegExp(/require\(['"]([^'"]+)['"]\)/g); // matches requires

//   return eventStream
//     .map((file, cb) => {
//       if (!file.isNull()) {
//         const content = file.contents.toString();
//         if (reqPattern.test(content)) {
//           file.contents = Buffer.from(
//             content.replace(reqPattern, (req, oldPath) => {
//               console.log(oldPath);
//               if (!aliases[oldPath]) {
//                 return req;
//               }
//               if (aliases[oldPath][0] === ".") {
//                 const oldFolder = path.dirname(path.resolve(file.path));
//                 const targetFile = path.resolve(aliases[oldPath]);
//                 const newPath = path.resolve(oldFolder, targetFile);

//                 return `require("${normalizePath(newPath)}")`;
//               } else {
//                 return `require("${normalizePath(aliases[oldPath])}")`;
//               }
//             })
//           );
//         }
//       }
//       cb(null, file);
//     })
//     .on("error", handleError);
// }

// gulp.task("babel", () =>
//   gulp
//     .src(src)
//     .pipe(babel(babelrc))
//     .on("error", handleError)
//     // .pipe(aliasify(config.aliases))
//     .pipe(gulp.dest(dist))
//     .on("error", handleError)
// );

// gulp.task("build", callback => {
//   runSequence(["babel"], callback);
// });

const platformConfigs = {
  web: {
    extensions: [".web.tsx", ".web.ts", ".tsx", ".ts"]
  },
  ios: {
    extensions: [
      ".ios.tsx",
      ".ios.ts",
      ".native.tsx",
      ".native.ts",
      ".tsx",
      ".ts"
    ]
  },
  android: {
    extensions: [
      ".android.tsx",
      ".android.ts",
      ".native.tsx",
      ".native.ts",
      ".tsx",
      ".ts"
    ]
  }
};

function getPlatform() {
  const platform = argv.platform || "web";

  if (!Object.keys(platformConfigs).includes(platform)) {
    throw `Unsupported platform: ${platform}`;
  }
  return platform;
}

// Handle args
const platform = getPlatform();
gutil.log(gutil.colors.yellow(`platform: ${platform}`));

const paths = {
  src: path.resolve(__dirname, "src"),
  dist: path.resolve(__dirname, "dist"),
  tmp: path.resolve(__dirname, "tmp")
};

const getTempPath = () => {
  return path.resolve(paths.tmp, platform);
};

const srcGlob = path.resolve(paths.src, "**/*");

function platformify() {
  return eventStream.map((origFile, cb) => {
    // console.log(file.path);
    const file = origFile.clone({ contents: false });
    if (file.isDirectory()) {
      return cb();
    }
    // Check the file is exactly for the platform
    const { extensions } = platformConfigs[platform];
    const fileName = path.basename(file.path);
    const [baseName, ...extNames] = fileName.split(".");
    const extName = "." + extNames.join(".");
    if (!extensions.includes(extName)) {
      return cb();
    }
    file.path = file.path
      .replace(paths.src, getTempPath())
      .replace(
        new RegExp(`${fileName}$`),
        `${baseName}.${extNames[extNames.length - 1]}`
      );
    // Map to tmp path for each platform
    cb(null, file);
  });
}

const tsProject = ts.createProject(`tsconfig.${platform}.json`);

gulp.task("copy", () => {
  gulp
    .src(srcGlob)
    .pipe(platformify())
    .pipe(gulp.dest(paths.dist))
    .pipe(tsProject({ typescript }))
    .on("error", handleError);
});

gulp.task("watch-copy", () =>
  watcher(srcGlob, file => {
    console.log(file);
  })
);

gulp.task(
  "build-webpack",
  shell.task(`node_modules/.bin/webpack --env.platform=${platform}`)
);

gulp.task("build", cb => runSequence(["copy", "build-webpack"], cb));

gulp.task(
  "watch",
  shell.task(`node_modules/.bin/webpack --watch --env.platform=${platform}`)
);
