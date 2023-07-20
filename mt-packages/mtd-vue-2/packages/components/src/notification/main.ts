
import Main from './notification'
import { PopupManage } from '@utils/popper'
import { toConstructor } from '@ss/mtd-adapter'
import { isVNode, isFunction } from '@utils/type'
import { NotificationOptions } from './types'

const NotificationConstructor = toConstructor(Main)
const instances: any[] = []
let seed = 1
// notification的间隔距离px
const spacing = 12

const Notification = function (options?: NotificationOptions | string) {
  options = options || { message: '' }
  if (typeof options === 'string') {
    options = {
      message: options,
    }
  }
  const userOnClose = options.onClose
  const id = 'notification_' + seed++
  const position = options.position || 'top-right';

  (options ).onClose = function () {
    Notification.close(id, userOnClose)
  }

  const children = isVNode(options.message)
    ? [(options ).message]
    : undefined

  const zIndex = PopupManage.nextZIndex()
  let verticalOffset = options.offset || 0
  instances
    .filter((item) => item.position === position)
    .forEach((item) => {
      verticalOffset += item.$el.offsetHeight + spacing
    })
  verticalOffset += spacing

  const { context } = NotificationConstructor(
    {
      ...options,
      message: children ? 'REPLACED_BY_VNODE' : options.message,
      id: id,
      zIndex,
      verticalOffset,
    },
    children,
  );
  (context as any).dom = (context as any).$el
  PopupManage.open(context)
  instances.push(context)
  return context
};

['success', 'warning', 'info', 'error'].forEach((type) => {
  (Notification as any)[type] = (options: NotificationOptions | string) => {
    if (typeof options === 'string' || isVNode(options)) {
      options = {
        message: options as string,
      }
    }
    options.type = type as any
    return Notification(options)
  }
})

Notification.close = function (id: string, userOnClose?: Function) {
  let index = -1
  const len = instances.length
  const instance = instances.filter((instance, i) => {
    if (instance.id === id) {
      index = i
      return true
    }
    return false
  })[0]
  if (!instance) return
  PopupManage.close(instance)
  if (userOnClose && isFunction(userOnClose)) {
    userOnClose(instance)
  }

  instances.splice(index, 1)

  if (len <= 1) return
  const position = instance.position
  const removedHeight = instance.dom.offsetHeight

  for (let i = index; i < len - 1; i++) {
    const tempInstance = instances[i]
    if (tempInstance.position === position) {
      tempInstance.dom.style[instance.verticalProperty] =
        parseInt(tempInstance.dom.style[instance.verticalProperty], 10) -
        removedHeight -
        spacing +
        'px'
    }
  }
}

Notification.closeAll = function () {
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].close()
  }
}

Notification.COMPONENT = Main
export default Notification
