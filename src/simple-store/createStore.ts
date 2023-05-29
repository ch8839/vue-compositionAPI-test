import { reactive } from '@vue/composition-api'

export const createStore = () => {
  return reactive({
    count: 0,
    increment() {
      this.count++
    }
  })
}