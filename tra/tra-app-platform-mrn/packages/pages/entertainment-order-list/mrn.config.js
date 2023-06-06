// mrn.config.js 配置文档
// http://mrn.sankuai.com/docs/guide/conf.html#mrn-config-js

module.exports = {
  name: 'entertainmentorderlist',
  main: './index.tsx',
  biz: 'gc',
  bundleType: 1,
  bundleDependencies: ['@mrn/mrn-base'],
  debugger: {
    moduleName: 'entertainment_order_list',
    initialProperties: {
      hideNavigationBar: true
    }
  },
  assets: [
    './pn/pn_mtorderlist.json',
    './pn/pn_dporderlist.json'
  ]
}
