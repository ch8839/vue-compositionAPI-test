import { typeOf, isArray, isObject } from './type'

// scrollTop animation
export function scrollTop(
  el: Element | Window,
  from = 0,
  to: number,
  duration = 500,
  endCallback?: Function,
) {
  if (isNaN(to) || isNaN(from)) {
    endCallback && endCallback()
    return
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame =
      window.webkitRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60)
      }
  }
  const difference = Math.abs(from - to)
  const step = Math.ceil((difference / duration) * 50)

  
  function scroll(start: number, end: number, step: number) {
    if (start === end) {
      endCallback && endCallback()
      return
    }

    let d = start + step > end ? end : start + step
    if (start > end) {
      d = start - step < end ? end : start - step
    }

    if (el === window) {
      window.scrollTo(d, d)
    } else {
      (el as Element).scrollTop = d
    }
    window.requestAnimationFrame(() => scroll(d, end, step))
  }
  scroll(from, to, step)
}

export const sharpMatcherRegx = /#([^#]+)$/

export function escapeRegexpString(value = '') {
  return String(value).replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
}

export function firstUpperCase(str: string) {
  return str.toString()[0].toUpperCase() + str.toString().slice(1)
}

export function deepCopy(data: any) {
  const t = typeOf(data)
  let o

  if (t === 'array') {
    o = []
  } else if (t === 'object') {
    o = {}
  } else {
    return data
  }

  if (t === 'array') {
    for (let i = 0; i < data.length; i++) {
      (o as Array<any>).push(deepCopy(data[i]))
    }
  } else if (t === 'object') {
    for (const i in data) {
      (o as any)[i] = deepCopy(data[i])
    }
  }
  return o
}

export const noop = () => {}

const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (
  val: object,
  key: string | symbol,
): key is keyof typeof val => hasOwnProperty.call(val, key)

export type Prop = {
  o: any;
  k: string;
  v: any;
};

export function getPropByPath(
  obj: Record<string, any>,
  path: string,
  strict?: boolean,
): Prop {
  let tempObj = obj
  if (hasOwn(obj, path)) {
    return {
      o: obj,
      k: path,
      v: obj[path],
    }
  }
  path = path.replace(/\[(\w+)\]/g, '.$1')
  path = path.replace(/^\./, '')

  const keyArr = path.split('.')
  let i = 0
  for (let len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj && !strict) break
    const key = keyArr[i]
    if (key in tempObj) {
      tempObj = tempObj[key]
    } else {
      if (strict) {
        // eslint-disable-next-line max-len
        throw new Error(`[warn]: unable get ${path} in ${obj}`)
      }
      break
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj ? tempObj[keyArr[i]] : null,
  }
}
export function mergeDeep(target: any, source: any) {
  if (!source) {
    return target
  }

  Object.keys(source).forEach((key) => {
    const targetValue = target[key]
    const sourceValue = source[key]

    if (!(key in target)) {
      target[key] = sourceValue
    } else if (typeof sourceValue !== typeof targetValue) {
      target[key] = sourceValue
    } else if (isArray(targetValue)) {
      target[key] = sourceValue
    } else if (isObject(targetValue)) {
      target[key] = mergeDeep(targetValue, sourceValue)
    } else {
      target[key] = sourceValue
    }
  })
  return target
}

export const getValueByPath = function (
  object: Record<string, any>,
  prop: string,
) {
  if (object === undefined || object === null) {
    return object
  }
  const p = getPropByPath(object, prop)
  return p.v
}

export function findIndex(arr: any[], value: any) {
  let index = -1
  arr.some((v, i) => {
    const r = v === value
    if (r) {
      index = i
    }
    return r
  })
  return index
}

export function includes(arrs: any[], value: any) {
  return findIndex(arrs, value) > -1
}
