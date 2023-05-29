import Vue from 'vue'
import App from './app.vue'
import VueRouter from 'vue-router'
import VueCompositionAPI from '@vue/composition-api'
import MTD from '@components/index'
import router from './routes'
// import '@components/theme-chalk/fonts/mtdicon.js'

import APIDoc from './components/api-doc.vue'
import DemoBlock from './components/demo-block.vue'
import HighlightCode from './components/highlight-code.vue'
import DesignTag from './components/design-tag.vue'
import HighPerformanceTag from './components/high-performance-tag.vue'
import VersionTag from './components/version-tag.vue'

Vue.config.devtools = true
Vue.use(VueCompositionAPI)
Vue.use(MTD as any)
Vue.use(VueRouter)

Vue.component('ApiDoc', APIDoc)
Vue.component('DemoBlock', DemoBlock)
Vue.component('HighlightCode', HighlightCode)
Vue.component('DesignTag', DesignTag)
Vue.component('HighPerformanceTag', HighPerformanceTag)
Vue.component('VersionTag', VersionTag)

const FRAME = (window as any).MTD_Frame // eslint-disable-line
if (FRAME) {
  FRAME.mount({
    project: 'component-vue',
    nav: {
      subBar: {
        tabs: {
          activeValue: '',
          list: [{
            title: '组件示例',
            value: 'components',
          },
          {
            title: '开发文档',
            value: 'doc',
          },
          {
            title: '业务组件托管 <i class="mtdicon mtdicon-forward-o"></i>',
            value: 'sc',
            href: 'https://component.sankuai.com?utm_source=mtd-vue',
            target: '_blank',
          },
          {
            title: '低代码物料 <i class="mtdicon mtdicon-forward-o"></i>',
            value: 'lowcode',
            href: 'https://km.sankuai.com/page/1340542742',
            target: '_blank',
          },
          {
            title: '代码仓库 <i class="mtdicon mtdicon-forward-o"></i>',
            value: 'code',
            href: 'https://dev.sankuai.com/code/repo-detail/ss/mtd-vue-next/file/list?branch=refs%2Fheads%2Fmaster',
            target: '_blank',
          }],
        },
      },
    },
    feedback: {
      feedback: 'https://tt.sankuai.com/ticket/create?cid=112&tid=2189&iid=9445',
      feedback_list: 'https://tt.sankuai.com/ticket/handle?filter=createdBy',
      dxQRCode: 'https://msstest.sankuai.com/v1/mss_d895c43e068542d6986e312787d9109d/test/ss-home/qrcode.png',
    },
    env: process.env.NODE_ENV,
    sso: false,
    onSuccess: () => {
      new Vue({ // eslint-disable-line
        render: h => h(App),
        router,
      }).$mount('#app')
    },
    onError: (error: Error) => {
      console.error(error)
    },
  })
}
