import { inject, computed, ComponentPublicInstance } from '@ss/mtd-adapter'
import { menuComp, submenuComp } from '@components/menu/types'
export const useMenu = (ins: ComponentPublicInstance<any>) => {
  const menu = inject<menuComp>('menu') as menuComp // 必须存在
  const submenu = inject<submenuComp | null>('submenu', null)

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
