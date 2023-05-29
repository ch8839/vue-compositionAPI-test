import { reactive } from '@vue/composition-api'
export const store = reactive({
  count: 0,
  increment() {
    this.count++
  }
})