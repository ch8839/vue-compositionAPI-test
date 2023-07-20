import Vue from 'vue'
import { vSlotsDirective } from './directives'

export function test() {
  console.log('我是Vue2')
}

export * from './hooks'
export * from './utils'
export * from './components'
export * from './directives'

export * from '@vue/composition-api'

export function defineEmits(arr: string[]): string[] {
  return arr
}

Vue.directive('slots', vSlotsDirective)

export function install(vue: typeof Vue, components: any[]) {
  components.map(function (component) {
    vue.component(component.name, component)
  })
  /* const $mtd = {
    notify: Notification,
    message: Message,
    confirm: Confirm,
  }

  Vue.prototype.$mtd = $mtd */
}