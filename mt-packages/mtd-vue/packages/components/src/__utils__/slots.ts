// import { CPI } from '@components/types/component'
import vueVersion from '@hooks/vue-version'

export function getScopedSlotsInRender(ins: any, name = 'default') {
  if (vueVersion === '2') {
    return ins.$scopedSlots[name]
  } else {
    return ins.$slots[name]
  }
}

export function getSlotsInRender(ins: any, name = 'default') {
  if (vueVersion === '2') {
    return ins.$slots[name]
  } else {
    return ins.$slots[name]
  }
}