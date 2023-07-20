import { CPI } from '../types/component'

/*
* 当你的组件 inheritAttrs: false 可用，且只能用在根节点上
*/
export function classNames(ins: CPI, classes?: Object | Array<any>) {
  return [
    ins.$attrs.class,
    classes,
  ]
}

/*
* 当你的组件 inheritAttrs: false 可用，且只能用在根节点上
*/
export function styles(ins: CPI, style?: Object) {
  return {
    ...ins.$attrs.style,
    ...style,
  }
}

/* Q: 为什么使用上面的函数？
*  A: 因为在Vue3中开启了 inheritAttrs: false 之后，attrs一切东西不会挂到根节点上，
*     class、style 也惨遭波及，这个问题在vue2不会有
*/

/* Q: 如果不是应用在根节点上我也要想拿到class style咋办？ 
*  A: 使用 useClassStyle
*/

/*
* v-html
*/
export function vHtml(arg?: string) {
  return {
    innerHTML: arg,
  }
}

/*
* v-text
*/
export function vText(arg?: string) {
  return {
    innerText: arg,
  }
}

/*
* toProps
*/
export function toProps(arg: any) {
  return arg
}

