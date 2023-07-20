import { CPI } from '../types/component'
import {
  VNode,
} from 'vue'

// ———————————— 对实例的操作

/**
 * 返回父母实例devServer
 */
export function getParentIns(ins: CPI) {
  return ins && ins.$parent
}

/**
 * 判断这个实例上有没有用户给予的prop配置
 */
export function hasProp(
  ins: CPI,
  prop: string,
): boolean {
  if (!ins) { return false }
  const vnode = ins.$.vnode
  return vnode && vnode.props
    ? prop in vnode.props
    : false
}


// ———————————— 对vnode 的操作

const isObject = (arg: any) => { return Object.prototype.toString.call(arg) === '[object Object]' }
/**
 * 判断这个vnode是不是MTD的组件
 */
export function isComponentVNode(vnode: VNode) {
  const { type } = vnode
  return isObject(type)
}

/**
 * 获取组件对应的名称
 */
export function getComponentName(vnode: VNode) {
  if (isComponentVNode(vnode)) {
    return (vnode.type as any).name
  }
  return undefined
}

/**
 * 获取组件对应的名称
 */
export function getElementFromComponent(
  vcomponent?: CPI,
): HTMLElement | undefined {
  let el = vcomponent?.$el
  return el
}
