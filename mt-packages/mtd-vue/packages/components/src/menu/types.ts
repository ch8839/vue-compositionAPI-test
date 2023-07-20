import { Emitter } from "@utils/mitt"

export interface menuItemComp {
  name: string
  level: number
  paddingLeft: number,
}

export interface menuComp {
  emitter: Emitter
  level: number
  baseIndent: number
  indent: number
  isCollapse: boolean
  router: boolean
  mode: MenuMode
  isExpanded: (param: submenuComp) => boolean
  isActive: (param: menuItemComp) => boolean
  getItemStyled: (param: menuItemComp) => Object
  toggleExpanded: (param: submenuComp) => void
}

export interface submenuComp {
  name: string
  emitter: Emitter
  level: number
  isExpanded: boolean
  getItemStyled: (param: menuItemComp) => Object
}

export type MenuMode = 'horizontal' | 'vertical' | 'inline'