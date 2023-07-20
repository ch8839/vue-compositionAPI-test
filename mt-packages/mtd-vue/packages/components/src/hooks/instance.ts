import {
  getCurrentInstance,
} from '@ss/mtd-adapter'

type ComponentIns = any | undefined

const vueInstance = (): ComponentIns => {
  const instance = getCurrentInstance()?.proxy

  return instance
}

export default vueInstance
