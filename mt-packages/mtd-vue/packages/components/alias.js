const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  "@components": resolve('src'),
  "@utils": resolve('src/__utils__'),
  "@tests": resolve('src/__tests__'),
  "@hooks": resolve('src/hooks'),
}
