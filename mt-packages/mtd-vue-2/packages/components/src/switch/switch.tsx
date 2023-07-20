import {
  defineComponent, computed, PropType,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { MTDUIComponentSize } from '@components/types'
import LoadingCircle from '@components/loading/circle'
import { useFormItem } from '@components/form-item/useFormItem'

// todo: active: false, loading: true 时 样式错误
export default defineComponent({
  name: 'MtdSwitch',
  components: {
    LoadingCircle,
  },
  inheritAttrs: true,
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    modelValue: [String, Number, Boolean, Function, Object, Array],
    trueValue: {
      type: [String, Number, Boolean, Function, Object, Array],
      default: true,
    },
    falseValue: {
      type: [String, Number, Boolean, Function, Object, Array],
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String as PropType<MTDUIComponentSize>,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    name: String,
    checkedChildren: String,
    unCheckedChildren: String,
  },
  slots: ['checkedChildren', 'unCheckedChildren'],
  emits: ['change', 'input', 'update:modelValue'],
  setup(props, ctx) {
    const { emit } = ctx
    const config = useConfig()
    const prefix = config.getPrefixCls('switch')
    const formItemHook = useFormItem(props, ctx)

    const m_disabled = formItemHook.disabled

    const m_actived = computed(() => {
      return props.modelValue === props.trueValue
    })
    const wrapperCls = computed(() => [
      `${prefix}`,
      {
        [`${prefix}-active`]: m_actived.value,
        [`${prefix}-disabled`]: m_disabled.value || props.loading,
        [`${prefix}-${props.size}`]: props.size,
        [`${prefix}-loading`]: props.loading,
      },
    ])
    const handleClick = (e: Event) => {
      e.preventDefault()
      if (m_disabled.value || props.loading) {
        return false
      }
      const value = m_actived.value ? props.falseValue : props.trueValue
      emit('input', value)
      emit('update:modelValue', value)
      formItemHook.m_handleChange(value)
    }
    return {
      m_actived,
      wrapperCls,
      prefix,
      handleClick,
      m_disabled,
    }
  },
  render() {
    const { m_actived, wrapperCls, prefix, handleClick, size } = this
    const {
      loading,
      checkedChildren,
      unCheckedChildren,
    } = this.$props
    return (
      <span class={wrapperCls} onClick={handleClick}>
        <span class={`${prefix}-btn`}>
          {loading &&
            <loading-circle
              thickness={1}
              size={size === 'large' ? 15 : 12}
            />
          }
        </span>
        <span class={`${prefix}-inner`}>
          {m_actived
            ? (getSlotsInRender(this, 'checkedChildren') || checkedChildren)
            : (getSlotsInRender(this, 'unCheckedChildren') || unCheckedChildren)}
        </span>
      </span>
    )
  },
})
