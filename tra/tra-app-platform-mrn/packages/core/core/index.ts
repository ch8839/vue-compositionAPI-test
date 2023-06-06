import { configure } from 'mobx'

configure({
  useProxies: 'never',  // mobx不使用代理
  enforceActions: 'never',
})

export * from 'mobx'
export * from 'mobx-react'

export {
  moduleRegister
} from './moduleRegister'

export {
  mobserver as observer,
  registerBasicInteraction,
} from './internals'

export {
  Bootstrap,
  useCoreContext,
} from './Container'