import { debounce as db, flow } from 'lodash'

/* eslint-disable @typescript-eslint/no-explicit-any */
export function addHiddenProp<T>(object: T, propName: PropertyKey, value: any) {
  Object.defineProperty(object, propName, {
    enumerable: false,
    writable: true,
    configurable: true,
    value
  })
}

type Fn = (...args: any[]) => any
export type DecorateFnType<T> = (...args: T[]) => (fn: Fn) => Fn

type Descriptor<T> = TypedPropertyDescriptor<T> & { initializer?: () => T }

/**
 * 创建装饰器，适用于类里面的方法
 * @param  decrateFn
 */
export const createDecorate =
  <T>(decrateFn: DecorateFnType<T>) =>
  (...args: T[]) =>
  (target: any, name: string | symbol, descriptor?: Descriptor<Fn>): any => {
    // typescript: @decorate method = () => {}
    if (!descriptor) {
      if (!target.__decorators) target.__decorators = {}
      if (!target.__decorators[name]) target.__decorators[name] = []
      target.__decorators[name].push(decrateFn(...args))
      Object.defineProperty(target, name, {
        configurable: true,
        enumerable: false,
        get() {
          return undefined
        },
        set(this, value) {
          // console.log(target.__decorators)
          addHiddenProp(this, name, flow(target.__decorators[name])(value))
        }
      })
    } else {
      // babel / typescript: @decorate method() { }
      if (descriptor.value) {
        return {
          value: decrateFn(...args)(descriptor.value),
          enumerable: false,
          configurable: true,
          writable: true
        }
      }
      // babel: @decorate method = () => {}
      const { initializer } = descriptor
      return {
        enumerable: false,
        configurable: true,
        writable: true,
        initializer() {
          return decrateFn(...args)(initializer!.call(this))
        }
      }
    }
  }

/**
 * 创建装饰器，适用于类里面的方法
 * @param  decrateFn
 */
export const createDecorateWithoutParams = <T extends Fn>(fn: T) => {
  return createDecorate(() => fn)()
}

export const asyncLockFn = <T>(fn: (...args: any[]) => Promise<T>) => {
  let loading = false
  return function (this: any, ...args: any[]) {
    if (loading) {
      console.warn('locked')
      return Promise.resolve()
    }
    loading = true
    const res = fn.apply(this, args)
    if (res instanceof Promise) {
      res
        .then(d => {
          loading = false
          return d
        })
        .catch(e => {
          loading = false
          throw e
        })
    } else {
      loading = false
    }
    return res
  }
}

/**
 * 异步锁
 */
export const asyncLock = createDecorateWithoutParams(asyncLockFn)

type WrapFn = (params: { start: boolean; data?: any; error?: Error }) => void

export const asyncWrapFn =
  <T>(wrapFn: WrapFn | string) =>
  (fn: (...args: any[]) => Promise<T> | T) => {
    return function (this: any, ...args: any[]) {
      const wrap =
        typeof wrapFn === 'function'
          ? wrapFn.bind(this)
          : this[wrapFn].bind(this)
      wrap({ start: true })
      const res = fn.apply(this, args)

      if (res instanceof Promise) {
        return res
          .then(d => {
            wrap({
              start: false,
              data: d
            })
            return d
          })
          .catch(e => {
            wrap({
              start: false,
              error: e
            })
            throw e
          })
      } else {
        wrap({ start: false, data: res })
        return res
      }
    }
  }

/**
 * 异步拦截
 */
export const asyncWrap = createDecorate(asyncWrapFn)

export const throttleFn =
  (duration: number) =>
  <T extends Fn>(func: T) => {
    let before = Date.now() - duration
    return function (this: any, ...args: Parameters<T>) {
      const current = Date.now()
      if (current - before >= duration) {
        before = current
        return func.call(this, ...args)
      }
    }
  }

/**
 * 截流，防止函数调用过于频繁
 * @param duration 延时
 */
export const throttle = createDecorate(throttleFn)

export const debounce = createDecorate(
  (wait: number) => (fn: Fn) => db(fn, wait)
)
