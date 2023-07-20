import { computed, nextTick, hasProp as hasPropInComp } from "@ss/mtd-adapter"
import vueInstance from "@hooks/instance"
import useProvide from './useProvide'
import { InputStatus } from '@components/input/types'

export function useFormItem(props: any, ctx: any) {

  const ins = vueInstance()

  const { injectFormItem } = useProvide()
  const formItem = injectFormItem()

  const hasProp = computed((): boolean => {
    return !!(formItem && formItem.prop)
  })
  const loading = computed<boolean>(() => {
    if (hasPropInComp(ins, 'loading')) {
      return props.loading
    }
    return formItem && formItem.status === 'validating'
  })
  const status = computed<InputStatus | undefined>(() => {
    if (hasPropInComp(ins, 'status')) {
      return props.status
    }

    return formItem && formItem.status
  })
  const hasFeedback = computed<boolean>(() => {
    if (!status.value) {
      return false
    }
    if (hasPropInComp(ins, 'hasFeedback')) {
      return props.hasFeedback
    }
    return formItem && formItem.hasFeedback
  })

  // PS：使用 form-item 要求 内组件 需要存在focus 和 blur 两种方法
  // @Methods
  function _handleBlur(...args: any[]) {
    ctx.emit('blur', ...args)
    if (/* !options.blur &&  */hasProp.value) {
      nextTick(() => {
        formItem && formItem.emitter.emit('formBlur')
      })
    }
  }

  function _handleChange(...args: any[]) {
    ctx.emit('change', ...args)
    if (hasProp.value) {
      nextTick(() => {
        formItem && formItem.emitter.emit('formChange')
      })
    }
  }

  return {
    status,
    hasFeedback,
    loading,

    _handleBlur,
    _handleChange,
  }
}


// @说明: 如何使用这个hook
/*
  满足使用这个hook 的内组件有以下特点：
  ① 具有 blur、change 事件 (至少存在change)
  ② 具有 status、loading 属性 (可以都没有)

  其中：status 替代了之前的属性 invalid，新增了 seccess 和 warning 两种状态
  这对我们针对不同状态的组件样式提出了要求
  import { InputStatus } from '@components/input/types'
  status: {
    type: String as PropType<InputStatus>,
  },

  使用:
  import { useFormItem }  from '@components/form-item/useFormItem'
  const formItemHook = useFormItem(props, ctx)

  替换：
  emit('blur',e) => formItemHook._handleBlur(e)
  emit('change',value) => formItemHook._handleChange(value)

  新增:
  const _status = formItemHook.status
  const _loading = formItemHook.loading
  const _hasFeedback = formItemHook.hasFeedback
*/

// @已使用组件:
/*
  input,radio-group,picker?,select,textarea,rate,input-number
*/
