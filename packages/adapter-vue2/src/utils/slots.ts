export function getScopedSlotsInRender(ins: any, name = 'default') {
  return ins.$scopedSlots[name]
}

export function getAllScopedSlots(ins: any) {
  return ins.$scopedSlots
}

export function getSlotsInRender(ins: any, name = 'default') {
  return ins.$slots[name] || ins.$scopedSlots[name]?.()
}

export function vSlots(slots: any) {
  return { scopedSlots: slots }
}