import {
  getCurrentInstance,
} from '@vue/composition-api'

export const vueInstance = (): any => {
  const instance = getCurrentInstance()?.proxy
  return instance
}
