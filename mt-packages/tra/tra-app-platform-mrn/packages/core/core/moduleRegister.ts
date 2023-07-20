import { IBasePage, IModule, ClassType } from '../interfaces/index'
import { printer, firstLetterLower, CONSOLE_TYPE } from '../utils'

/**
 * 装饰器，注册模块
 */
export function moduleRegister<T extends IModule>(Module: ClassType<T>, moduleName = firstLetterLower(Module.name), ...args) {
  /**
   * @param {class} target - 具体的业务类
   */
  return function <T extends IBasePage>(target: ClassType<T>): void {
    if (!target.prototype.__modules) {
      target.prototype.__modules = {} // modules字段注册在最开始有挂载模块的类的原型上
    }
    if (target.prototype.__modules[moduleName]) {
      printer(CONSOLE_TYPE.INFO, `模块名【${moduleName}】覆盖，新模块使用module` , Module.name)
    }
    target.prototype.__modules[moduleName] = {
      moduleClass: Module,
      args,
    }
  }
}

/**
 * 挂载模块类的实例到业务类实例上 - 代理的时候会对模块进行单独的处理
 * 注意：module 不支持嵌套挂载，仅能直接挂载于业务类上
 * @param {instance} target - 业务类实例
 */
export function mountModule<T extends IBasePage>(target: T) {
  if (!target.__modules) return
  const moduleNames = Object.keys(target.__modules)
  if (!moduleNames.length) return
  for (let i = 0; i < moduleNames.length; i++) {
    const moduleName = moduleNames[i]
    if (target[moduleName] !== undefined) {
      printer(CONSOLE_TYPE.ERROR, `模块名【${moduleName}】已经被使用，请重命名模块` , '')
      continue
    }
    const Module = target.__modules[moduleName].moduleClass
    const args = target.__modules[moduleName].args
    // @ts-ignore
    target[moduleName] = new Module(...args)
  }
}