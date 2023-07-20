import { inject, computed, provide } from "@ss/mtd-adapter"
import { CollapseProvide } from './types'

export const collapseSymbol = Symbol('collapse')

export interface CollapseProps {
  value?: any,
  type?: string,
}

export const provideCollapse = (collapseProvide: CollapseProvide) => {
  provide<CollapseProvide>(collapseSymbol, collapseProvide)
}

export const useCollapse = (props: CollapseProps) => {
  const collapse = inject<CollapseProvide>(collapseSymbol) as CollapseProvide

  const active = computed(() => {
    const isArray = Array.isArray(collapse.value.value)
    return isArray
      ? collapse.value.value.indexOf(props.value) > -1
      : collapse.value.value === props.value
  })

  function emitItemClick() {
    collapse.emitter.emit('itemClick', [!active.value, props.value])
  }

  return {
    active,
    rightAlignArrow: collapse.rightAlignArrow,
    triangleArrow: collapse.triangleArrow,
    emitItemClick,
  }
}
