module.exports = {
  presets: ['@mrn/mrn-babel-preset', 'module:metro-react-native-babel-preset'],
  plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]]
}