import { ComponentRenderProxy } from "@vue/composition-api";

/*
* 当你的组件 inheritAttrs: false 可用，且只能用在根节点上
*/
export function classNames(ins: ComponentRenderProxy<any>, classes?: Object | Array<any>) {
  return classes
}

/*
* 当你的组件 inheritAttrs: false 可用，且只能用在根节点上
*/
export function styles(ins: ComponentRenderProxy<any>, style?: Object) {
  return style
}