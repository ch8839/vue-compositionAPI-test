import { CPI } from '../types/component'
import {
  ComponentPublicInstance,
  createApp,
  h,
  App,
  ComponentInternalInstance,
  ComponentInstance,
  ComponentRenderProxy,
} from '@vue/composition-api'
import {
  VNode,
} from 'vue'

/**
 * 返回父母实例
 */
export function getParentIns(ins: CPI) {
  return ins && ins.$parent
}


/**
 * 获取组件对应的名称
 */
export function getComponentName(vnode: VNode) {
  // @ts-ignore
  return vnode.componentOptions?.Ctor?.options.name
}

/**
 * 从实例获取el
 */
export function getElementFromComponent(
  vcomponent?: ComponentPublicInstance,
): HTMLElement | undefined {
  let el = vcomponent?.$el
  while (el && el.nodeType === 3 && !el.textContent) {
    // Text
    el = el.nextSibling
  }
  return el
}

export function hasProp(
  vc: ComponentPublicInstance | ComponentInternalInstance | any,
  prop: string,
): boolean {
  if (vc && vc.$options) {
    return prop in vc.$options.propsData
  }
  return false
}

export function applyProps(vnode: VNode, props: Record<string, any>): VNode {
  const componentOptions: any = {
    ...vnode.componentOptions,
    propsData: {
      ...vnode.componentOptions?.propsData,
      ...props,
    },
  }
  return {
    ...vnode,
    componentOptions,
  }
  // 💣3.0用注释部分
  /* return {
    ...vnode,
    props: {
      ...props,
      ...vnode.pr,
    },
  } */
}

/* export function getChildInstanceListVue3(
  vnode: VNode | null,
  childNames: string[],
  paneInstanceList: ComponentPublicInstance[] = [],
): ComponentPublicInstance[] {
  if (!vnode) {
    return []
  }
  Array.from((vnode.children || []) as ArrayLike<VNode>).forEach(
    (vNodeItem) => {
      const { type } = vNodeItem
      if (vNodeItem.component) {
        const { name } = type as Component
        if (name && childNames.indexOf(name) > -1) {
          vNodeItem.component.proxy &&
            paneInstanceList.push(vNodeItem.component.proxy)
        } else {
          // 尽可能使用component 的 subtree 作为vnode
          getChildInstanceList(
            vNodeItem.component.subTree,
            childNames,
            paneInstanceList,
          )
        }
      } else if (Array.isArray(vNodeItem.children)) {
        getChildInstanceList(vNodeItem, childNames, paneInstanceList)
      }
    },
  )
  return paneInstanceList
}
 */
// vue2
export function getSlots(ins: ComponentInstance) {
  return ins.$slots.default
}

// vue2 在第一层级搜索对应名称的子节点
// 💣 Vue3 版本留意一下 type === Fragment 的情况
export function getChildInstanceList(
  vm: ComponentRenderProxy<any>,
  names: string[],
  isDFS?: boolean,
): CPI[] {
  if (!isDFS) {
    const childrenIns = (vm.$vnode.componentOptions && vm.$vnode.componentOptions.children)
      ? vm.$vnode.componentOptions.children.map(vnode => vnode.componentInstance)
      : []
    return childrenIns.filter(ins => {
      return ins && ins.$options.name && names.indexOf(ins.$options.name) > -1
    }) as ComponentRenderProxy<any>[]
  } else {
    // DFS
    const resultInss: any[] = []
    const childrenVNodes = (vm.$vnode.componentOptions && vm.$vnode.componentOptions.children)
      ? vm.$vnode.componentOptions.children
      : []
    if (childrenVNodes.length > 0) {
      childrenVNodes.forEach(vnode => {
        getChildInstanceList_DFS(vnode, names, resultInss)
      })
    }
    return resultInss
  }
}

function getChildInstanceList_DFS(
  vnode: VNode,
  names: string[],
  resultInss: ComponentInstance[],
) {
  const ins = vnode.componentInstance
  if (ins && ins.$options.name) {
    if (names.indexOf(ins.$options.name) > -1) {
      resultInss.push(ins)
    } else {
      const childrenVNodes = vnode.componentOptions && vnode.componentOptions.children
      if (childrenVNodes && childrenVNodes.length > 0) {
        childrenVNodes.forEach(vnode => {
          getChildInstanceList_DFS(vnode, names, resultInss)
        })
      }
    }
  }
}


// 使用场景： 入参：当前实例的vnode 应用于slot.default()

export function getChildVNodeList(
  vnode: VNode,
  childNames: string[],
  vnodeList: VNode[] = [],
): VNode[] {
  getChildVNodeList_Vue2(vnode, childNames, vnodeList)
  return vnodeList
}
function getChildVNodeList_Vue2(
  vnode: VNode,
  childNames: string[],
  vnodeList: VNode[] = [],
): VNode[] {
  return vnodeList
}


/* export function getChildVNodeList_Vue3(
  vnode: VNode,
  childNames: string[],
  vnodeList: VNode[] = [],
): VNode[] {
  const childrenObj: VNodeNormalizedChildren = vnode.children
  const { type } = vnode

  // 访问到需求类型组件了
  if (isObject(type)) {
    const { name } = type as Component
    if (name && childNames.indexOf(name) > -1) {
      vnodeList.push(vnode)
      return vnodeList
    }
  }

  if (childrenObj && typeof childrenObj !== 'string') {
    const children = Array.from(
      (Array.isArray(childrenObj)
        ? childrenObj
        : (childrenObj as any).default()) as ArrayLike<VNode>,
    )
    children.forEach((vNodeItem) => {
      getChildVNodeList(vNodeItem, childNames, vnodeList)
    })
  }

  return vnodeList
} */


// vue3 版本
/* export function toConstructor(component: any) {
  return function (
    props: any,
    children?: any,
  ): {
    app: App;
    $: ComponentPublicInstance;
    context: ComponentPublicInstance;
  } {
    const div = document.createElement('div')
    const { getContainer } = props
    if (getContainer) {
      const root = getContainer()
      root.appendChild(div)
    } else {
      document.body.appendChild(div)
    }
    // eslint-disable-next-line prefer-const
    let app: App
    function destroyed() {
      app.unmount(div)
    }
    app = createApp({
      unmounted() {
        div.parentNode?.removeChild(div)
      },
      render() {
        return h(
          component,
          {
            ...props,
            destroyed,
            ref: 'instance',
          },
          children,
        )
      },
    })
    const $ = app.mount(div)
    return {
      app,
      $,
      context: $.$refs.instance as ComponentPublicInstance,
    }
  }
} */

interface ConstructorOption {
  noAttrs?: boolean
}

// vue2 版本
export function toConstructor(component: any, option: ConstructorOption = {}) {
  return function (
    props: any,
    children?: any,
  ): {
    app: App;
    $: ComponentPublicInstance;
    context: ComponentPublicInstance;
  } {
    const div = document.createElement('div')
    const { getContainer } = props

    if (getContainer) {
      const root = getContainer()
      root.appendChild(div)
    } else {
      document.body.appendChild(div)
    }
    // eslint-disable-next-line prefer-const
    let app: App
    function destroyed() {
      app.unmount()
    }
    app = createApp({
      render() {
        return h(
          component,
          {
            props: {
              ...props,
              destroyed,
            },
            attrs: !option.noAttrs ? props : {},
            ref: 'instance',
          },
          children,
        )
      },
    })
    const $ = app.mount(div) as any

    return {
      app,
      $,
      context: $.$refs.instance as ComponentPublicInstance,
    }
  }
}
