import { isServer } from '@utils/env'
import { isKey } from '@utils/key-codes'
import { Emitter } from '@utils/mitt'
import { warn } from '@utils/log'

const Manager = {
  zIndex: 2000,
  stack: [] as any[],

  open(instance: any) {
    const { stack } = Manager
    if (!stack.includes(instance)) {
      stack.push(instance)
    }
  },

  close(instance: any) {
    const { stack } = Manager
    const index = stack.lastIndexOf(instance)
    if (index > -1) {
      stack.splice(index, 1)
    }
  },

  nextZIndex: function () {
    return '' + Manager.zIndex++
  },

  getLastPopup() {
    const { stack } = Manager
    if (stack.length > 0) {
      return stack[stack.length - 1]
    }
  },
}

if (!isServer) {
  window.addEventListener('keydown', function (event) {
    if (isKey(event)) {
      const topPopup = Manager.getLastPopup()
      if (topPopup) {
        if (!topPopup.emitter) {
          warn('PopupManage', 'instance must has emitter, now is:', topPopup)
          return
        }
        (topPopup.emitter as Emitter)?.emit('esc')
      }
    }
  })
}
export default Manager
