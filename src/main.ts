import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)

import App from './App.vue'
import router from './router'
import '@ss/mtd-vue2/lib/theme-chalk/select.css'

Vue.config.productionTip = false
import { createStore } from './simple-store/createStore'

new Vue({
  router,
  // 提供应用级别的 store
  provide: {
    simpleStore: createStore()
  },
  render: (h) => h(App),
}).$mount('#app')
