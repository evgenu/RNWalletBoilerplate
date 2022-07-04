// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('@expo/metro-config');

// extra config is needed to enable `expo-crypto-polyfills`
module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  return {
    ...defaultConfig,
    resolver: {
      extraNodeModules: {
        ...defaultConfig.resolver.extraNodeModules,
        ...require('expo-crypto-polyfills'),
      },
    },
  };
})();
