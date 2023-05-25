// module.exports = {
//   presets: ["module:metro-react-native-babel-preset"],
// };
// module.exports = function (api) {
//   api.cache(true);
//   return {
//     // ... other project config such as presets and plugins
//     env: {
//       production: {
//         plugins: ["transform-remove-console"],
//       },
//     },
//   };
// };
module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  env: {
    production: {
      plugins: ["transform-remove-console"], //removing consoles.log from app during release (production) versions
    },
  },
};
