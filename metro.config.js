const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  const {
    resolver: { assetExts, sourceExts },
  } = defaultConfig;

  return mergeConfig(defaultConfig, {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer/react-native'),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
  });
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
