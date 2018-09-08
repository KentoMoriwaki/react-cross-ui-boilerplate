const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "./packages/react-cross-ui-boilerplate");

// Base paths to specific folders
const basePaths = {
  nodeModulesPath: path.resolve(__dirname, "./node_modules"),
  sourcePath: path.resolve(root, "./src/"),
  tempPath: path.resolve(root, "./temp/"),
  webAppPath: path.resolve(root, "./web/")
};

let targetPlatform = "web";

function setTargetPlatform(target) {
  switch (target) {
    case "ios":
    case "android":
    case "web":
    case "windows":
    case "electron":
    case "macos":
    case "tests":
      targetPlatform = target;
      break;

    default:
      targetPlatform = "web";
      break;
  }
}

function getCommonFallback(targetPlatform) {
  switch (targetPlatform) {
    case "android":
    case "ios":
    case "windows":
    case "macos":
      return "native";
    case "web":
    case "electron":
    case "tests":
    default:
      return "web";
  }
}

function getTempPath(mypath) {
  return path.join(basePaths.tempPath, targetPlatform, mypath);
}

function getSourcePath(mypath) {
  return path.join(basePaths.sourcePath, mypath);
}

function getTempPath(mypath) {
  return path.join(basePaths.tempPath, targetPlatform, mypath);
}

function getObjPath(mypath) {
  return path.join(getTempPath("obj"), mypath);
}

function getModuleAliases(targetPlatform) {
  const aliases = {};
  const fallbackSearchOrder = [
    `index.${getCommonFallback(targetPlatform)}`,
    "index"
  ];

  const modules = fs.readdirSync(
    path.resolve(basePaths.sourcePath, "./modules")
  );

  modules.forEach(moduleName => {
    let moduleVariant = `index.${targetPlatform}`;

    fallbackSearchOrder.forEach(fallback => {
      const variantPath = path.resolve(
        basePaths.sourcePath,
        "./modules",
        moduleName,
        moduleVariant
      );
      // TODO: Handle .ts
      if (
        fs.existsSync(`${variantPath}.js`) ||
        fs.existsSync(`${variantPath}.jsx`)
      ) {
        return true;
      }
      moduleVariant = fallback;
    });

    const modulePath =
      targetPlatform === "web" ||
      targetPlatform === "tests" ||
      targetPlatform === "electron"
        ? getSourcePath("modules")
        : "./" + getObjPath("modules");
    aliases[
      `modules/${moduleName}`
    ] = `${modulePath}/${moduleName}/${moduleVariant}`;
  });

  console.log(aliases);
  return aliases;
}

module.exports = platform => {
  setTargetPlatform(platform);
  return {
    root,
    aliases: getModuleAliases(platform)
  };
};
