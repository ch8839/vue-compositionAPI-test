

const isServer = false
const defaultOptions = {
  capture: false,
  passive: false,
}

function noop() { }

function scrollTop() {
  const scroll = document.querySelector('.app') as HTMLElement
  return scroll.scrollTop
}

function offsetTop(el: HTMLElement) {
  let top = 0
  do {
    top += el.offsetTop
  } while ((el = el.offsetParent as HTMLElement))
  return top
}

function appear(el: HTMLElement, otherTop = 0) {
  const offTop = offsetTop(el)
  return (
    offTop + el.scrollHeight > window.innerHeight + scrollTop() &&
    offTop + otherTop < window.innerHeight + scrollTop()
  )
}

function throttle(action: Function, delay: number) {
  let last = 0
  return function () {
    const curr = new Date().getTime()
    if (curr - last > delay) {
      // eslint-disable-next-line prefer-rest-params
      action.apply(undefined, arguments)
      last = curr
    }
  }
}
const on = (function () {
  if (!isServer && !!document.addEventListener) {
    return function (node: any, event: Event, handler: Function) {
      // 判断 node 为 vnode
      const element = node && node.$el ? node.$el : node
      if (element && event && handler) {
        element.addEventListener(event, handler, defaultOptions)
        return () => off(element, event, handler)
      }
      return noop
    }
  } else {
    return function (node: any, event: Event, handler: Function) {
      const element = node && node.$el ? node.$el : node
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
        return () => off(element, event, handler)
      }
      return noop
    }
  }
})()

const off = (function () {
  if (!isServer && (document as any).removeEventListener) {
    return function (node: any, event: Event, handler: Function) {
      // 判断 node 为 vnode
      const element = node && node.$el ? node.$el : node
      if (element && event) {
        element.removeEventListener(event, handler, defaultOptions)
      }
    }
  } else {
    return function (node: any, event: Event, handler: Function) {
      const element = node && node.$el ? node.$el : node
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

const backToTop = function (element: HTMLElement, rate: number) {
  const doc = element
  let scrollTop = doc.scrollTop

  const top = function () {
    scrollTop = scrollTop + (0 - scrollTop) / (rate || 2)
    // 临界判断，终止动画
    if (scrollTop < 1) {
      doc.scrollTop = 0
      return
    }
    doc.scrollTop = scrollTop
    requestAnimationFrame(top)
  }
  top()
}

let fakeElem: HTMLTextAreaElement
function copy(content: string) {
  if (!fakeElem) {
    fakeElem = document.createElement('textarea')
    fakeElem.style.cssText =
      'border: 0;padding: 0;margin: 0; position: absolute; left: -9999px;'
  }

  fakeElem.setAttribute('readonly', '')
  fakeElem.value = content

  document.body.appendChild(fakeElem)

  fakeElem.select()
  document.execCommand('copy')
}

export default {
  on,
  off,
  copy,
  appear,
  throttle,
  scrollTop,
  backToTop,
}
