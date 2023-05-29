import { ComponentRenderProxy } from '@vue/composition-api'

/*
* 当你的组件 inheritAttrs: false 可用，且只能用在根节点上
*/
export function classNames(ins: ComponentRenderProxy<any> | any, classes?: Object | Array<any>) {
  return classes
}

/*
* 当你的组件 inheritAttrs: false 可用，且只能用在根节点上
*/
export function styles(ins: ComponentRenderProxy<any> | any, style?: Object) {
  return style
}

/*
* v-html
*/
export function vHtml(arg?: string) {
  return {
    domProps: {
      innerHTML: arg,
    },
  }
}

/*
* v-text
*/
export function vText(arg?: string) {
  return {
    domProps: {
      innerText: arg,
    },
  }
}

/*
* toProps
*/
export function toProps(arg: any) {
  return {
    props: arg,
    attrs: arg,
  }
}
