import { App, version } from 'vue'

export function test() {
  console.log('我是Vue3, 我是全新版本')
}

export const isVue3 = version[0] === '3'

export function install(app: App, components: any[], install_To_MTD: any) {
  components.map((component) => {
    app.use(component)
  })

  app.config.globalProperties.$mtd = install_To_MTD
}

export * from './hooks'
export * from './utils'

export * from 'vue'
export * from './components'