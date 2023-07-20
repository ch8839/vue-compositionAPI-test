
import { VNode } from "vue"
import { CPI } from "../types/component"

export function getScopedSlotsInRender(ins: CPI, name = 'default', arg?: any) {
  return getSlotsInRender(ins, name, arg)
}

export function getSlotsInRender(ins: CPI, name = 'default', arg?: any) {
  return ins.$slots[name]?.(arg)
}

export function vSlots(slots: any) {
  return { ['v-slots']: slots }
}
