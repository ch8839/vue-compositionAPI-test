const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  namespace: 'mtd',
  pkgName: 'mtd-vue-next', // 包名改动可能需要手动更改代码中 import 的包名
  fullName: '@ss/mtd-vue-next',
  port: 8080,
  themes: ['theme-chalk','theme-yellow'],
  isProd: isProd,
  isTest: process.env.BABEL_ENV === 'test',
  publicPath: isProd ? '/mtd/vue-next/' : '/',

  adapterVuePKG: '@ss/mtd-adapter-vue2', // 通过修改这里可以达到切换运行环境的效果
}
