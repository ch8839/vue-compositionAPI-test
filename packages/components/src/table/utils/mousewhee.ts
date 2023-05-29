import normalizeWheel from 'normalize-wheel'

const isFirefox = typeof navigator !== 'undefined' &&
  navigator.userAgent.toLowerCase().indexOf('firefox') > -1

const mousewheel = function (element: HTMLElement, callback: Function) {
  if (element && element.addEventListener) {
    element.addEventListener(
      isFirefox ? 'DOMMouseScroll' : 'mousewheel',
      function (event) {
        const normalized = normalizeWheel(event)
        callback && callback.apply(undefined, [event, normalized])
      },
    )
  }
}

export default {
  bind(el: HTMLElement, binding: any) {
    mousewheel(el, binding.value)
  },
}

