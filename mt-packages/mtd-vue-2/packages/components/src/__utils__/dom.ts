import { Ref } from '@ss/mtd-adapter'
import { isServer } from './env'

const defaultOptions = {
  capture: false,
  passive: false,
}

type HANLER = (this: HTMLElement, ev: Event) => any
function noop() { }
/* istanbul ignore next */
export const off = (function () {
  if (!isServer && !!document.removeEventListener) {
    return function (node: { $el: HTMLElement } | HTMLElement | any, event: string, handler: HANLER) {
      // 判断 node 为 vnode
      const element = node && node.$el ? node.$el : node
      if (element && event) {
        element.removeEventListener(event, handler, defaultOptions)
      }
    }
  } else {
    return function (node: any, event: string, handler: HANLER) {
      const element = node && node.$el ? node.$el : node
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

export const on = (function () {
  if (!isServer && !!document.addEventListener) {
    return function (node: any, event: string, handler: HANLER) {
      // 判断 node 为 vnode
      const element = node && node.$el ? node.$el : node
      if (element && event && handler) {
        element.addEventListener(event, handler, defaultOptions)
        return () => off(element, event, handler)
      }
      return noop
    }
  } else {
    return function (node: any, event: string, handler: HANLER) {
      const element = node && node.$el ? node.$el : node
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
        return () => off(element, event, handler)
      }
      return noop
    }
  }
})()

export const focus = (ele: Ref<HTMLInputElement | null>) => {
  ele.value?.focus()
}

export const blur = (ele: Ref<HTMLInputElement | null>) => {
  ele.value?.blur()
}

export function hasClass(el: Element, className: string) {
  if (!el || !className) {
    return false
  }
  if (el.classList) {
    return el.classList.contains(className)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + className + ' ') > -1
  }
}

export function addClass(el: Element, className: string) {
  if (!el) return
  let curClass = el.className
  const classes = (className || '').split(' ')

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.add(clsName)
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

export function removeClass(el: Element, className: string) {
  if (!el || !className) return
  const classes = className.split(' ')
  let curClass = ' ' + el.className + ' '

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ')
    }
  }
  if (!el.classList) {
    el.className = curClass.trim()
  }
}

export function isOverflowElement(element: HTMLElement): boolean {
  // Firefox wants us to check `-x` and `-y` variations as well
  const { overflow, overflowX, overflowY } = getComputedStyle(element)
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX)
}

export function isHTMLElement(value: any): value is HTMLElement {
  return value instanceof window.HTMLElement
}

export function getNodeName(node: Node | Window): string {
  return node && (node as Node).nodeName ? (node as Node).nodeName.toLowerCase() : ''
}

export function isShadowRoot(node: Node): node is ShadowRoot {
  // Browsers without `ShadowRoot` support
  if (typeof ShadowRoot === 'undefined') {
    return false
  }

  const OwnElement = (window as any).ShadowRoot
  return node instanceof OwnElement || node instanceof ShadowRoot
}

export function getParentNode(node: Node): Node {
  if (getNodeName(node) === 'html') {
    return node
  }

  return (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // eslint-disable-next-line
    // @ts-ignore
    node.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    node.parentNode || // DOM Element detected
    (isShadowRoot(node) ? node.host : null) || // ShadowRoot detected
    document.documentElement
  )
}

export function getNearestOverflowAncestor(element?: Node): HTMLElement {
  if (!element) {
    // eslint-disable-next-line
    // @ts-ignore assume body is always available
    return window.document.body
  }
  const parentNode = getParentNode(element)

  if (['html', 'body', '#document'].includes(getNodeName(parentNode))) {
    // eslint-disable-next-line
    // @ts-ignore assume body is always available
    return window.document.body
  }

  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode
  }

  return getNearestOverflowAncestor(parentNode)
}
