export function getScopedSlotsInRender(ins: any, name = 'default', arg?: any) {
  return ins.$scopedSlots[name]?.(arg)
}

export function getSlotsInRender(ins: any, name = 'default') {
  return ins.$slots[name] || ins.$scopedSlots[name]?.()
}

export function vSlots(slots: any) {
  return { scopedSlots: slots }
}