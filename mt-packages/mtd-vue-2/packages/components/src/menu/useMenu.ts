import { inject, computed, ComponentPublicInstance } from '@ss/mtd-adapter'

export type MenuIns = any

export type submenuIns = any

export const useMenu = (ins: ComponentPublicInstance<any>) => {
  const menu = inject<MenuIns>('menu')!
  const submenu = inject<submenuIns | null>('mtd_submenu', null)

  const parent = computed(() => submenu || menu)

  const level = computed(() => parent.value.level + 1)

  const style = computed(() => menu.getItemStyled(ins))
  const paddingLeft = computed(() => {
    return (menu.baseIndent + level.value * menu.indent) - 8
  })
  return {
    menu,
    submenu,
    level,
    style,
    paddingLeft,
  }
}
