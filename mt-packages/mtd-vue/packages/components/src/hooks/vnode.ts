import {
  onMounted,
  onUnmounted,
  ref,
} from '@ss/mtd-adapter'
import vueVersion from './vue-version'
import vueInstance from './instance'

const getParentIns = () => {
  const instance = vueInstance()

  return 1
}

export default getParentIns
