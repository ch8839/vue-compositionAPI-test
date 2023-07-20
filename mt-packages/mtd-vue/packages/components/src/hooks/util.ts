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

export function onAMounted(handler: Function) {
  onMounted(handler)
  onActivated(handler)
}

export function onAUnmounted(handler: Function) {
  onUnmounted(handler)
  onDeactivated(handler)
}
