/**
 * webpack.config.ts
 * Copyright: Microsoft 2018
 *
 * Configuration for webpack, the bundling tool used for the web.
 */

const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");

const platform = process.env.PLATFORM || "web";
const isDev = process.env.NODE_ENV !== "production";
const isTest = platform === "tests";

const babelrc = require("./.babelrc");
const getConfig = require("./buildconfig.js");
const config = getConfig(platform, isDev);

function getAliases(platform) {
  const items = fs.readdirSync(path.resolve(__dirname, "src/modules"));
  const aliases = items.reduce((memo, item) => {
    memo[`modules/${item}`] = path.resolve(
      __dirname,
      "src/modules",
      item,
      "index"
    );
    return memo;
  }, {});
  if (platform === "web") {
    aliases["react-native$"] = "react-native-web";
  }
  return aliases;
}

/**
 * @type webpack.webpackConfig
 */
const webpackConfig = env => {
  const platform = env.platform;

  const aliases = getAliases(platform);

  // TODO: Load from gulpfile
  let extensions = [".ts", ".tsx"];
  if (platform === "web") {
    extensions = [".web.tsx", ".web.ts", ...extensions];
  } else if (platform === "ios" || platform === "android") {
    extensions = [
      `.${platform}.tsx`,
      `.${platform}.ts`,
      ".native.tsx",
      ".native.ts",
      ...extensions
    ];
  }

  return {
    context: config.root,
    entry: "./src/index",
    mode: isDev ? "development" : "production",

    target: "node",
    output: {
      filename: `index.${platform}.js`,
      path: path.resolve(config.root, "dist"),
      libraryTarget: "commonjs2"
    },
    externals: [nodeExternals()],

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
      modules: [path.resolve("."), path.resolve("./node_modules")],
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions,
      alias: aliases
    },

    module: {
      rules: [
        {
          test: /\.(t|j)sx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: babelrc
          }
        }
      ]
    },

    plugins: [
      // Replace flags in the code based on the build variables. This is similar to
      // the replaceFlags method in gulpfile.js. If you make a change here, reflect
      // the same change in the other location.
      new webpack.DefinePlugin({
        __DEV__: isDev,
        __TEST__: isTest,
        __WEB__: true,
        __ANDROID__: false,
        __IOS__: false,
        __WINDOWS__: false,
        __MACOS__: false
      })
    ]
  };
};

module.exports = webpackConfig;
