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
export function getParentIns(ins: CPI): any {
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
}

// vue2
export function getSlots(ins: ComponentInstance) {
  return ins.$slots.default
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

/**
 * 获取 特定的 子组件实例
 * 
 * vue2 中不需要通过插槽获取子节点，直接从实例可以获得，所以第四个参数无用，但是必须要支持兼容vue3的api参数格式
 */
export function getChildInsList(
  ins: ComponentRenderProxy<any>,
  names: string[],
  option?: GetCPIOption,
  childrenVNodes?: VNode[],
): (ComponentRenderProxy<any>)[] {

  let childInss: any[] = []
  const matchingFun = option?.isFuzzyMatch ? isLikeName : isSameName

  if (!ins.$children) {
    return []
  }

  childInss = ins.$children

  let insResult: ComponentRenderProxy<any>[] = []

  if (option && option.isDFS) {
    insResult = []
    if (childInss.length > 0) {
      childInss.forEach(childIns => {
        getChildInsList_DFS(childIns, names, insResult, matchingFun)
      })
    }
  } else {
    insResult = childInss.filter((child: ComponentRenderProxy<any>) => child && matchingFun(names, child.$options.name))
  }

  return insResult
}

function getChildInsList_DFS(
  ins: ComponentRenderProxy<any>,
  names: string[],
  resultInss: ComponentRenderProxy<any>[],
  matchingFun: Function,
) {
  if (ins && ins.$options.name) {
    if (matchingFun(names, ins.$options.name)) {
      resultInss.push(ins)
    } else {
      const childInss = ins.$children
      if (childInss && childInss.length > 0) {
        childInss.forEach(childIns => {
          getChildInsList_DFS(childIns, names, resultInss, matchingFun)
        })
      }
    }
  }
}

export function getChildVNodeList(
  ins: ComponentRenderProxy<any>,
  childNames: string[],
): VNode[] {
  const vnodeList: VNode[] = []
  const childVNodes = ins.$slots.default || []
  childVNodes.forEach((vnode) => {
    getChildVNodeList_DFS(vnode, childNames, vnodeList)
  })
  return vnodeList
}

export function getChildVNodeList_DFS(
  vnode: VNode,
  childNames: string[],
  vnodeList: VNode[] = [],
) {
  const name = getComponentName(vnode)
  if (childNames.indexOf(name) > -1) {
    vnodeList.push(vnode)
    return
  } else {
    const children = vnode.children
    children && children.forEach((vNodeItem) => {
      getChildVNodeList_DFS(vNodeItem, childNames, vnodeList)
    })
  }
}

interface ConstructorOption {
  noAttrs?: boolean
}

// vue2 版本
export function toConstructor(component: any, option: ConstructorOption = {}) {
  return function (
    props: any,
    children?: any,
    on?: any,
  ): {
    app: App;
    $: ComponentPublicInstance;
    context: ComponentPublicInstance;
    unmount: () => void
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
    const app = createApp({
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
            on: {
              ...on,
            },
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


    const $ = app.mount(div) as any
    const ins = $.$refs.instance as ComponentPublicInstance

    return {
      app,
      $,
      context: ins,
      unmount,
    }
  }
}

/**
 * 创建注释节点
 */
export function createCommentVNode(text: string) {
  return h('', text)
}

