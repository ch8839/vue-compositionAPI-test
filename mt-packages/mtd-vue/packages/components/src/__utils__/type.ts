import { VNode } from "vue"

export function typeOf(obj: any) {
  return Object.prototype.toString
    .call(obj)
    .toLowerCase()
    .replace(/(\[object )(\w+)(\])/g, '$2')
}

export function isNumber(v: any): v is number {
  return typeof v === 'number'
}

export function isBoolean(v: any): v is boolean {
  return typeof v === 'boolean'
}

export function isObject(v: any): v is Object {
  return Object(v) === v
}

export function isFunction(v: any): v is Function {
  return typeof v === 'function'
}

export function isUndef(v: any): v is undefined {
  return typeof v === 'undefined'
}

export function isDef(v: any) {
  return !isUndef(v)
}

export const isString = (val: unknown): val is string =>
  typeof val === 'string'

export function isExist(v: any) {
  return isDef(v) && v !== null && v !== ''
}

export const isPromise = (v: any): v is Promise<any> => {
  return isObject(v) && isFunction(v.then) && isFunction(v.catch)
}

export function isVNode(value: any): value is VNode {
  return value && (value as VNode).isComment !== undefined
}

export function isDate(v: any): v is Date {
  return v instanceof Date
}
// check native isArray first
export const isArray =
  Array.isArray ||
  function (value): value is Array<any> {
    return toString.call(value) === '[object Array]'
  }
