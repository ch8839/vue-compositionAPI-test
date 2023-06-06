/**
 * 实现组件深度样式定制
 * - 命名说明：
 * - `comp`:所有组件名 'Badege' 'Tags' 'Tip'
 * - `theme`:组件原有的样式函数 (theme)=>{...}
 * - `custom`:用户设定的组件样式对象 {styles,isReplace}
 * - `styles`:组件原有的样式函数返回的样式对象 {root,item,text,wrapper...}
 *
 * @date 2019-11-25
 * @author jicanghai
 */

import deepmerge from 'deepmerge'
// import * as comps from '../..'

/** 所有组件名-样式函数字典 */
export const compStylesMap = {} as any

/** 所有组件名称集合 */
export type CompNames = keyof typeof compStylesMap

// /** 所有样式函数-组件名的真Map对象 */
// export let themeCompNameMap = new Map(<[(theme: any) => any, CompNames][]>(
//   Object.keys(compStylesMap).map((key: CompNames) => [compStylesMap[key], key])
// ))

/** 所有组件名-样式类型(interface)字典 */
export type CompStylesMap = typeof compStylesMap
// {
//   [K in CompNames]: ReturnType<typeof compStylesMap[K]>
// }

/** 用户自定义组件样式对象 */
export interface CompCustom<T extends CompNames> {
  // compName: T
  styles: Partial<CompStylesMap[T]>
  isReplace?: boolean
}

export type CompCustomMapType = { [K in CompNames]: CompCustom<K> }
// & {
//   [key: string]: CompCustom<any>
// }

/** 所有组件名-自定义样式对象字典 */
export const compCustomMap: CompCustomMapType = {} as any // 真正用于储存用户设定的样式对象的字典

/**
 * 设置自定义组件样式
 * - 注意：调用此函数后不会触发重新渲染，需要手动触发重新渲染。（如果在App挂载前执行此函数则无此问题）
 * - 使用Provider上的state来自定义组件样式无此问题。
 *
 * @param {T} compName 组件名
 * @param {Partial<CompStylesMap[T]>} styles 组件的样式对象
 * @param {boolean} isReplace 是否为替换模式。`true`时此对象将完全替换内置样式，`false`时为合并覆盖内部样式对象。默认为false
 */
export function setStyles<T extends CompNames>(
  compName: T,
  styles: Partial<CompStylesMap[T]>,
  isReplace: boolean = false
) {
  if (typeof isReplace !== 'boolean') isReplace = false
  if (compName in compCustomMap) {
    compCustomMap[compName] = deepmerge(compCustomMap[compName], {
      styles,
      isReplace
    } as CompCustom<any>)
  } else {
    compCustomMap[compName] = { styles, isReplace } as CompCustom<any>
  }
  return compCustomMap
}

/**
 * 设置多个自定义组件样式
 *
 * @param {CompCustomMapType} customMap 多个组件样式对象字典
 */
export function setStylesAll(customMap: Partial<CompCustomMapType>) {
  Object.keys(customMap || {}).forEach((name: CompNames) => {
    const custom = { ...customMap[name as any] }
    setStyles(name, custom.styles, custom.isReplace)
  })
  return compCustomMap
}

//所有组件名： MessageList
