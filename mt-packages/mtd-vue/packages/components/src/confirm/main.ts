import confirmVue from './confirm'
import { isVNode } from '@utils/type'
import { isPromise } from '@utils/type'
import { toConstructor } from '@utils/vnode'
import { ConfirmOptions } from './types'

const ConfirmConstructor = toConstructor(confirmVue, { noAttrs: true })
export const instances: any[] = []

let seed = 0
function remove(id: string) {
  let index = -1
  for (let i = 0; i < instances.length; i++) {
    if (instances[i].id === id) {
      index = i
      break
    }
  }
  if (index > -1) {
    instances.splice(index, 1)
  }
}

const Confirm = (options: ConfirmOptions) => {
  return new Promise((resolve, reject) => {
    const id = 'confirm_' + seed++

    options = options || {}
    if (typeof options === 'string') {
      options = {
        message: options,
      }
    }


    const children = isVNode(options.message)
      ? [(options as ConfirmOptions).message]
      : undefined
    const props = {
      ...options,
      id,
      message: children ? 'REPLACED_BY_VNODE' : options.message,
      onOk: function (params: any) {
        const result: undefined | any = options.onOk && options.onOk(params)
        if (isPromise(result)) {
          return result.then((r: any) => {
            remove(id)
            return resolve(r)
          })
        }
        remove(id)
        resolve(params)
        return result
      },
      onCancel: function (params: any) {
        const result: undefined | any =
          options.onCancel && options.onCancel(params)
        if (isPromise(result)) {
          return result.then(() => {
            remove(id)
            params.$$mtd = true
            return reject(params)
          })
        }
        remove(id)
        reject(params)
        return result
      },
    }

    const { context: instance } = ConfirmConstructor(props, children);
    (instance as any).dom = (instance as any).$el
    instances.push(instance)
  })
}

Confirm.closeAll = function () {
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].handleCancel()
  }
  instances.splice(0, instances.length)
}
Confirm.getInstance = function () {
  return instances.length > 0 ? instances[instances.length - 1] : null
}

Confirm.COMPONENT = confirmVue

export default Confirm
export { Confirm }
