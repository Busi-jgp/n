const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Ignore temp directories created by native packages (expo-contacts etc.) during install
config.resolver = {
  ...config.resolver,
  blockList: [
    ...(Array.isArray(config.resolver?.blockList) ? config.resolver.blockList : []),
    /node_modules\/.*_tmp_\d+\/.*/,
  ],
};

module.exports = config;
