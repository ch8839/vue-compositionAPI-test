import { ObjectDirective } from '@ss/mtd-adapter'
import normalizeWheel from 'normalize-wheel'
import { on } from '@utils/dom'

const isFirefox =
  typeof navigator !== 'undefined' &&
  navigator.userAgent.toLowerCase().indexOf('firefox') > -1

const mousewheel = function (element: HTMLElement, callback: Function) {
  on(element, isFirefox ? 'DOMMouseScroll' : 'mousewheel', function (
    event: Event,
  ) {
    const normalized = normalizeWheel(event)
    callback && callback.apply(undefined, [event, normalized])
  })
}

export default {
  mounted(el: HTMLElement, binding: any) {
    mousewheel(el, binding.value)
  },
} as ObjectDirective
