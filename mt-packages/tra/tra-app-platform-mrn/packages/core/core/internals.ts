import { observable, action, computed, makeObservable, configure } from 'mobx'
import { observer } from 'mobx-react'
import { memo } from 'react'
import { mountModule } from './moduleRegister'
import { printer, CONSOLE_TYPE, getGlobal } from '../utils'
// interfaces
import { IBasePage, IModule, IReactComponent, ClassType } from '../interfaces/index'

configure({
  enforceActions: 'never',
})

const RESERVED_NAMES = ['constructor', '__modules']

const hasSymbol = typeof Symbol === "function" && Symbol.for

const ReactMemoSymbol = hasSymbol
    ? Symbol.for("react.memo")
    : typeof memo === "function" && memo((props: any) => null)["$$typeof"]

// 对所有属性 annotation 的处理
export function makeObservableBiz<T extends IBasePage | IModule>(target: T): T {
  const annotationMap = {}
  const devRegistered = {}
  // 原型链
  let curProto = target
  while (curProto !== Object.prototype) {
    let nameList = Object.getOwnPropertyNames(curProto)
    for (let i = 0; i < nameList.length; i++) {
      const name = nameList[i]
      if (RESERVED_NAMES.includes(name)) continue
      const descriptor = Object.getOwnPropertyDescriptor(curProto, name)
      let type = 0 // enum: 0 - property, 1 - method, 2 - getter
      if (descriptor.value instanceof Function) {
        type = 1
        // 调试模式下，增加方法调用显示
        if (getGlobal().__TRA_DEV__) {
          const originFn = descriptor.value.bind(target)
          const CtorName = curProto.constructor.name
          const fn = (...args) => {
            printer(CONSOLE_TYPE.INFO, '操作调用', `${CtorName}.${name}`)
            return originFn(...args)
          }
          Object.defineProperty(curProto, name, {
            configurable: true,
            enumerable: false,
            value: fn,
            writable: true,
          })
        }
        annotationMap[name] = action.bound
      } else if (descriptor.get instanceof Function) {
        type = 2
        annotationMap[name] = computed
      } else if (target['__modules'] && target['__modules'][name]) {
        makeObservableBiz(target[name])
      } else {
        annotationMap[name] = observable
      }
      if (getGlobal().__TRA_DEV__) {
        // 注册 / 判断重名操作或getter
        if (type) {
          if (!devRegistered[name]) {
            devRegistered[name] = {
              name,
              source: curProto.constructor.name || '',
              type,
            }
          } else {
            printer(CONSOLE_TYPE.INFO, `${name} (${type === 1 ? 'method' : 'getter'}) 存在重写或拓展, 最终来源的类是`, `${devRegistered[name].source}`)
          }
        }
      }
    }
    curProto = Object.getPrototypeOf ? Object.getPrototypeOf(curProto) : curProto['__proto__']
  }
  makeObservable(target, annotationMap)
  return target
}

// 创建observable模型
export function generateCore<T extends IBasePage>(Business: ClassType<T>): T {
  const biz = new Business()
  mountModule(biz) // 挂载模块
  makeObservableBiz(biz) // 处理observable
  mountBasicInteraction(biz)
  return biz
}

// 封装后的observer
export function mobserver<T extends IReactComponent>(WrappedComponent: T): T {
  // 如果组件已经被memo包裹过，移除本身的memo
  let render = WrappedComponent
  if (WrappedComponent['$$typeof'] === ReactMemoSymbol) {
    render = WrappedComponent['type']
  }
  const memoized = observer(render)
  return memoized
}

// 注册基础交互能力（toast/dialog）
let interactionMap = {}
const recommandInteractions = ['toast', 'dialog']
export function registerBasicInteraction(key: string, fnCalledComponent: Function) {
  interactionMap[key] = fnCalledComponent
}

function mountBasicInteraction(core: IBasePage) {
  recommandInteractionsHint()
  const keys = Object.keys(interactionMap)
  for (let key of keys) {
    if (!interactionMap[key]) continue
    core[key[0] !== '$' ? `$${key}` : key] = interactionMap[key]
  }
}

function recommandInteractionsHint() {
  for (let key of recommandInteractions) {
    if (!interactionMap[key]) {
      printer(CONSOLE_TYPE.WARN, '建议注册函数式组件', key)
    }
  }
}
