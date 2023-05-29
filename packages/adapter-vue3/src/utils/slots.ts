
import { VNode, VNodeNormalizedChildren } from 'vue'
import { CPI } from '../types/component'

type ScopedSlots = (ins: any, name: string) => VNode[]

export function getScopedSlotsInRender(ins: CPI, name = 'default'): undefined | ((arg?: any) => ScopedSlots) {
  return ins.$slots[name]
    ? (arg?: any) => {
      const result = ins.$slots[name](arg)
      return !isEmptySlot(result) ? result : undefined
    }
    : undefined
}

export function getAllScopedSlots(ins: any) {
  return ins.$slots
}

export function getSlotsInRender(ins: CPI, name = 'default'): VNode[] | undefined {
  const result = ins.$slots[name]?.()
  return !isEmptySlot(result) ? result : undefined
}

export function vSlots(slots: any): any {
  return { ['v-slots']: slots }
}

function isEmptySlot(items: any) {
  if (!items || !items.length) return true
  return items.every(isEmptySlotContent)
}

function isEmptySlotContent(item: any) {
  const type = item.type.toString()
  if (type === 'Symbol(Fragment)' && (!item.children || !item.children.length)) return true
  if (type === 'Symbol(Comment)') return true
  if (type === 'Symbol(Text)' && !item.children.trim()) return true
  return false
}