// mrn.config.js 配置文档
// http://mrn.sankuai.com/docs/guide/conf.html#mrn-config-js

module.exports = {
  name: 'bookingpedicure',
  main: './index.tsx',
  biz: 'gc',
  bundleType: 1,
  bundleDependencies: ['@mrn/mrn-base'],
  debugger: {
    moduleName: 'booking_pedicure_order_create',
    initialProperties: {
      hideNavigationBar: true
    }
  }
}
