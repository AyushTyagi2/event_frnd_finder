const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = true;
const { withNativeWind } = require("nativewind/metro");




config.resolver.unstable_conditionNames = [
  "require",
  "react-native",
  "development",
];

const ALIASES = {
  tslib: "tslib/tslib.es6.js",
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  return context.resolveRequest(
    context,
    ALIASES[moduleName] ?? moduleName,
    platform
  );
};

module.exports = withNativeWind(config, {
  input: "./src/global.css",
});