import { hasClass, addClass, removeClass } from './dom'

let lockNumber = 0
const CLASSNAME = 'mtd-lock-scroll'

export function lock(el: HTMLElement) {
  if (!hasClass(el, CLASSNAME)) {
    addClass(el, CLASSNAME)
  }
  lockNumber++
}

export function unlock(el: HTMLElement) {
  lockNumber--
  if (lockNumber <= 0) {
    removeClass(el, CLASSNAME)
    lockNumber = 0
  }
}

export default {
  lock,
  unlock,
}
