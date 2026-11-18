module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Expo already loads reanimated — DO NOT add it again
      ["react-native-worklets/plugin"], // must be LAST
    ],
  };
};
