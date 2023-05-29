import Vue from 'vue'
export { VNode } from 'vue'
import { vSlotsDirective } from './directives'

export function test() {
  console.log('我是Vue2, 我是全新版本')
}

export const isVue3 = false


export * from './hooks'
export * from './utils'
export * from './components'
export * from './directives'

export * from '@vue/composition-api'

export function defineEmits(arr: string[]): string[] {
  return arr
}

Vue.directive('slots', vSlotsDirective)

export function install(vue: typeof Vue, components: any[], install_To_MTD: any) {
  components.map(function (component) {
    vue.component(component.name, component)
  })
  const $mtd = install_To_MTD
  Vue.prototype.$mtd = $mtd
}
