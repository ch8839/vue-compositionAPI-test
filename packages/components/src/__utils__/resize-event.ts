import ResizeObserver from 'resize-observer-polyfill'
import { isServer } from './env'

/* export type ResizableElement = CustomizedHTMLElement<{
  m__resizeListeners__: Array<(...args: unknown[]) => unknown>;
  m__ro__: ResizeObserver;
}>; */

export type ResizableElement = any

/* istanbul ignore next */
const resizeHandler = function (entries: ResizeObserverEntry[]) {
  for (const entry of entries) {
    const listeners =
      (entry.target as ResizableElement).m__resizeListeners__ || []
    if (listeners.length) {
      listeners.forEach((fn: Function) => {
        fn()
      })
    }
  }
}

/* istanbul ignore next */
export const addResizeListener = function (
  element: ResizableElement,
  fn: (...args: unknown[]) => unknown,
) {
  if (isServer) return
  if (!element.m__resizeListeners__) {
    element.m__resizeListeners__ = []
    element.m__ro__ = new ResizeObserver(resizeHandler)
    element.m__ro__.observe(element)
  }
  element.m__resizeListeners__.push(fn)
}

/* istanbul ignore next */
export const removeResizeListener = function (
  element: ResizableElement,
  fn: (...args: unknown[]) => unknown,
) {
  if (!element || !element.m__resizeListeners__) return
  element.m__resizeListeners__.splice(
    element.m__resizeListeners__.indexOf(fn),
    1,
  )
  if (!element.m__resizeListeners__.length) {
    element.m__ro__.disconnect()
  }
}
