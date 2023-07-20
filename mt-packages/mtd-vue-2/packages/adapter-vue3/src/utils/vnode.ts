import { CPI } from '../types/component'
import {
  Component,
  ComponentPublicInstance,
  VNode,
  VNodeNormalizedChildren,
  App,
  createApp,
  h,
} from 'vue'

// ———————————— ⭐️ 对实例的操作 ——————————————————————————————

/**
 * 返回父母实例devServer
 */
export function getParentIns(ins: CPI) {
  return ins && ins.$parent
}

/**
 * 驼峰转横杠
 */
function getKebabCase(str: string) {
  let temp = str.replace(/[A-Z]/g, function (i) {
    return '-' + i.toLowerCase()
  })
  if (temp.slice(0, 1) === '-') {
    temp = temp.slice(1)   //如果首字母是大写，执行replace时会多一个_，需要去掉
  }
  return temp
}


/**
 * 判断这个实例上有没有用户给予的prop配置
 */
export function hasProp(
  ins: CPI,
  prop: string,
): boolean {
  if (!ins) {
    return false
  }
  const vnode = ins.$.vnode

  // vue3 vnode 里面给到props 严格区分了 短横线命名法 和 驼峰命名法，判断的时候需要两者都判断
  return vnode && vnode.props
    ? prop in vnode.props || getKebabCase(prop) in vnode.props
    : false
}

/**
 * 获取组件对应的el元素
 */
export function getElementFromComponent(
  vcomponent?: CPI,
): HTMLElement | undefined {
  let el = vcomponent?.$el
  while (el && el.nodeType === 3 && !el.textContent) {
    // Text
    el = el.nextSibling
  }
  return el
}

/**
 * 获取 特定的 子组件实例
 * isDFS 是否需要进行深度搜索
 */

function isSlotChild(children: VNodeNormalizedChildren): boolean {
  return typeof children === 'object' && !Array.isArray(children)
}

function isLikeName(target: string[], name?: string) {
  return name && target.some(str => name.includes(str))
}

function isSameName(target: string[], name?: string) {
  return name && target.some(str => name === str)
}

interface GetCPIOption {
  isDFS?: boolean
  isFuzzyMatch?: boolean
}


export function getChildInsList(
  ins: CPI,
  childNames: string[],
  option?: GetCPIOption,
  childrenVNodes?: VNode[],
): ComponentPublicInstance[] {

  const matchingFun = option?.isFuzzyMatch ? isLikeName : isSameName

  if (childrenVNodes) {
    const children = childrenVNodes
    const fakerSubTree = { children } as VNode
    return fakerSubTree
      ? getChildInsList_DFS(fakerSubTree, childNames, [], matchingFun)
      : []
  }

  const subTree = (ins as ComponentPublicInstance).$.subTree
  return subTree
    ? getChildInsList_DFS(subTree, childNames, [], matchingFun)
    : []
}

export function getChildInsList_DFS(
  vnode: VNode | null,
  childNames: string[],
  paneInstanceList: ComponentPublicInstance[] = [],
  matchingFun: Function,
): ComponentPublicInstance[] {
  if (!vnode) {
    return []
  }
  const children = vnode.children

  Array.from((children || []) as ArrayLike<VNode>).forEach(
    (vNodeItem) => {
      const { type } = vNodeItem
      setTimeout(() => {

      })
      if (vNodeItem.component) {
        const { name } = type as Component

        if (matchingFun(childNames, name)) {
          vNodeItem.component.proxy &&
            paneInstanceList.push(vNodeItem.component.proxy)
        } else {
          // 尽可能使用component 的 subtree 作为vnode
          getChildInsList_DFS(
            vNodeItem.component.subTree,
            childNames,
            paneInstanceList,
            matchingFun,
          )
        }
      } else if (Array.isArray(vNodeItem.children)) {
        getChildInsList_DFS(vNodeItem, childNames, paneInstanceList, matchingFun)
      }
    },
  )
  return paneInstanceList
}

// ———————————— ⭐️ 对VNode的操作 ——————————————————————————————

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
 * 获取 特定的 子组件VNode
 */
// 使用场景： 入参：当前实例的vnode 应用于slot.default()
export function getChildVNodeList(
  ins: CPI,
  childNames: string[],
): VNode[] {
  const vnodeList: VNode[] = []
  const childVNodes = (ins as ComponentPublicInstance).$slots.default
    ? (ins as ComponentPublicInstance).$slots.default!()
    : []
  childVNodes.forEach((vnode) => {
    getChildVNodeList_DFS(vnode, childNames, vnodeList)
  })
  return vnodeList
}

export function getChildVNodeList_DFS(
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
      getChildVNodeList_DFS(vNodeItem, childNames, vnodeList)
    })
  }

  return vnodeList
}

export function applyProps(vnode: VNode, props: Record<string, any>): VNode {
  return {
    ...vnode,
    props: {
      ...props,
      ...vnode.props,
    },
  }
}

const toAttrsKey = (key: string) => {
  const temp = key.replace(key[0], key[0].toUpperCase())
  return 'on' + temp
}

export function toConstructor(component: any) {
  return function (
    props: any,
    children?: any,
    on?: any,
  ): {
    app: App;
    $: ComponentPublicInstance;
    context: ComponentPublicInstance;
    unmount: () => void;
  } {
    const div = document.createElement('div')
    const { getPopupContainer } = props

    if (getPopupContainer) {
      const root = getPopupContainer()
      root.appendChild(div)
    } else {
      document.body.appendChild(div)
    }

    const newOn: any = {}
    if(on) {
      for (const key in on) {
        newOn[toAttrsKey(key)] = on[key]
      }
    }


    const app = createApp({
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
            ...newOn,
          },
          children,
        )
      },
    })
    
    function destroyed() {
      unmount()
    }

    function unmount() {
      app.unmount()
      div.parentNode?.removeChild(div)
    }

    const $ = app.mount(div)
    return {
      app,
      $,
      context: $.$refs.instance as ComponentPublicInstance,
      unmount,
    }
  }
}