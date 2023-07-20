import {
  ref,
} from '@ss/mtd-adapter'
import vueInstance from './instance'
import {
  onAMounted,
  onAUnmounted,
} from './util'

// todo: to adapter
const getElement = () => {
  const instance = vueInstance()
  const el = ref<HTMLElement | undefined>()
  const set = () => {
    if (instance) {
      el.value = instance.$el
    }
  }
  const clear = () => {
    el.value = undefined
  }
  onAMounted(set)

  onAUnmounted(clear)

  return el
}

export default getElement
