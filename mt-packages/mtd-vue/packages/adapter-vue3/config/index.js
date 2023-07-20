const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test'; // process.env.BABEL_ENV === 'test',
const isVue3 = process.env.BUILD_VUE_VERSION === 'VUE3';
const isVue2 = !isVue3;

module.exports = {
  namespace: 'mtd',
  pkgName: 'mtd-vue', // 包名改动可能需要手动更改代码中 import 的包名
  fullName: '@ss/mtd-vue',
  port: 8086,
  themes: [
    'theme-chalk',
  ],
  isVue2,
  isVue3,
  isProd: isProd,
  isTest: isTest,
  publicPath: isProd ? '/mtd/vue/' : '/'
};
