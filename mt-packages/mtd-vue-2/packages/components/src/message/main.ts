import Main from './message'
import { isVNode, isFunction, isString } from '@utils/type'
import { PopupManage } from '@utils/popper'
import { MessageOptions } from './types'
import { toConstructor } from '@ss/mtd-adapter'

const MessageConstructor = toConstructor(Main)

const instances: any[] = []
let seed = 1
// message的间隔距离px
const spacing = 12

const Message = function (options: MessageOptions | string) {
  options = options || { message: '' }
  if (isString(options)) {
    options = {
      message: options,
    }
  }
  const userOnClose = options.onClose
  const id = 'message_' + seed++

  options.onClose = function () {
    Message.close(id, userOnClose)
  }

  const children = isVNode(options.message)
    ? [(options ).message]
    : undefined

  const zIndex = PopupManage.nextZIndex()
  let verticalOffset = options.offset || 0
  instances.forEach((item) => {
    verticalOffset += item.$el.offsetHeight + spacing
  })
  verticalOffset += spacing
  const { context } = MessageConstructor(
    {
      ...options,
      message: children ? 'REPLACED_BY_VNODE' : options.message,
      id,
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

['success', 'warning', 'info', 'error', 'loading'].forEach((type) => {
  (Message as any)[type] = (options: MessageOptions) => {
    if (typeof options === 'string' || isVNode(options)) {
      options = {
        message: options,
      }
    }
    options.type = type as any
    return Message(options)
  }
})

Message.close = function (id: string, userOnClose?: Function) {
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

  if (isFunction(userOnClose)) {
    userOnClose(instance)
  }
  instances.splice(index, 1)

  if (len <= 1) return
  const removedHeight = instance.dom.offsetHeight
  for (let i = index; i < len - 1; i++) {
    instances[i].dom.style[instance.verticalProperty] =
      parseInt(instances[i].dom.style[instance.verticalProperty], 10) -
      removedHeight -
      spacing +
      'px'
  }
}

Message.closeAll = function () {
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].close()
  }
  instances.splice(0, instances.length)
}

Message.COMPONENT = Main

export default Message
