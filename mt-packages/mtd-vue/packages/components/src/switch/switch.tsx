import {
  defineComponent, computed, PropType,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { MTDUIComponentSize } from 'src/types'
import LoadingCircle from '@components/loading/circle'

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
    modelValue: [String, Number, Boolean, Function, Object, Array, Symbol],
    trueValue: {
      type: [String, Number, Boolean, Function, Object, Array, Symbol],
      default: true,
    },
    falseValue: {
      type: [String, Number, Boolean, Function, Object, Array, Symbol],
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
  emits: ['change', 'input'],
  setup(props, { emit }) {
    const config = useConfig()
    const prefix = config.getPrefixCls('switch')

    const _actived = computed(() => {
      return props.modelValue === props.trueValue
    })
    const wrapperCls = computed(() => [
      `${prefix}`,
      {
        [`${prefix}-active`]: _actived.value,
        [`${prefix}-disabled`]: props.disabled || props.loading,
        [`${prefix}-${props.size}`]: props.size,
        [`${prefix}-loading`]: props.loading,
      },
    ])
    const handleClick = (e: Event) => {
      e.preventDefault()
      if (props.disabled || props.loading) {
        return false
      }
      const value = _actived.value ? props.falseValue : props.trueValue
      emit('input', value)
      emit('update:modelValue', value)
      emit('change', value)
    }
    return {
      _actived,
      wrapperCls,
      prefix,
      handleClick,
    }
  },
  render() {
    const { _actived, wrapperCls, prefix, handleClick, size } = this
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
          {_actived
            ? (getSlotsInRender(this, 'checkedChildren') || checkedChildren)
            : (getSlotsInRender(this, 'unCheckedChildren') || unCheckedChildren)}
        </span>
      </span>
    )
  },
})
