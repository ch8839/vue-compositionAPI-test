import { AnyFunction } from '@utils/types'
import {
  ComponentPublicInstance,
  onActivated,
  onMounted,
  onUnmounted,
  onDeactivated,
} from '@ss/mtd-adapter'

export const getCompName = (ins: ComponentPublicInstance<any>) => {
  // vue2
  return ins.$options.name
}

export function onAMounted(handler: AnyFunction<any>) {
  onMounted(handler)
  onActivated(handler)
}

export function onAUnmounted(handler: AnyFunction<any>) {
  onUnmounted(handler)
  onDeactivated(handler)
}
