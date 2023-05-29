import {
  getCurrentInstance,
} from 'vue'

export const vueInstance = () => {
  const instance = getCurrentInstance()?.proxy
  return instance as any
}
