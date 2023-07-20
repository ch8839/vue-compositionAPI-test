import { createApp } from 'vue'
import 'highlight.js/styles/default.css'
import router from './routes'
import App from './App.vue'
import MTD from '@components/index'
import DesignTag from './components/design-tag.vue'
import VersionTag from './components/version-tag.vue'
import APIDoc from './components/api-doc.vue'
import DemoBlock from './components/demo-block.vue'
import HighlightCode from './components/highlight-code.vue'

import '@components/themes/index.scss'

const app = createApp(App)
app
  .use(MTD)
  .use(router)
  .component('design-tag', DesignTag)
  .component('version-tag', VersionTag)
  .component('api-doc', APIDoc)
  .component('demo-block', DemoBlock)
  .component('highlight-code', HighlightCode)

window.MTD_Frame &&
  window.MTD_Frame.mount({
    project: 'component-vue',
    env: process.env.NODE_ENV,
    nav: {
      subBar: {
        tabs: {
          activeValue: '',
          list: [
            {
              title: '组件示例',
              value: 'components',
            },
            {
              title: '开发文档',
              value: 'doc',
            },
          ],
        },
      },
    },
    sso: true,
    feedback: {
      feedback:
        'https://tt.sankuai.com/ticket/create?cid=112&tid=2189&iid=9445',
      feedback_list: 'https://tt.sankuai.com/ticket/handle?filter=createdBy',
      dxQRCode:
        'https://msstest.sankuai.com/v1/mss_d895c43e068542d6986e312787d9109d/test/ss-home/qrcode.png',
    },
    onSuccess: function () {
      app.mount('#app')
    },
    onError: function (error: any) {
      console.error(error)
    },
  })
declare global {
  interface Window {
    MTD_THEME: any;
    MTD_Frame: any;
  }
}
