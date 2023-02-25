module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo", 'module:metro-react-native-babel-preset'],
    plugins: ["react-native-reanimated/plugin", "module:react-native-dotenv"],
    env: {
      development: {
        plugins: ['react-native-reanimated/plugin']
      },
      production: {
        plugins: ["react-native-paper/babel", "react-native-reanimated/plugin"],
      },
    },
  };
};
