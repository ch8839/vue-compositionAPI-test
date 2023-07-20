import printer, { CONSOLE_TYPE } from './console'
import coreError from './error'
import getGlobal from './global'

const plainObjectString = Object.toString()

function firstLetterUpper(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function firstLetterLower(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

function isObject(value: any): value is Object {
  return value !== null && typeof value === 'object'
}

function isPlainObject(value: any) {
  if (!isObject(value)) {
    return false
  }
  const proto = Object.getPrototypeOf(value)
  if (proto == null) {
    return true
  }
  const protoConstructor = Object.hasOwnProperty.call(proto, 'constructor') && proto.constructor
  return (
    typeof protoConstructor === 'function' && protoConstructor.toString() === plainObjectString
  )
}


function execFuncList(cbs: Array<Function> | Function, ...args: any) {
  if (!cbs) return
  if (Array.isArray(cbs)) {
    for (let cb of cbs) {
      if (typeof cb === 'function') {
        cb(...args)
      }
    }
  } else if (typeof cbs === 'function') {
    cbs(...args)
  }
}

export { 
  printer, 
  CONSOLE_TYPE,
  firstLetterUpper,
  firstLetterLower,
  coreError,
  isObject,
  isPlainObject,
  execFuncList,
  getGlobal,
}
