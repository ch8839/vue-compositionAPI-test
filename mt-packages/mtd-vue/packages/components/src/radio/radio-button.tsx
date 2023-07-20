import {
  defineComponent,
  computed,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { useRadioGroup } from '@components/radio-group/useRadioGroup'

export default defineComponent({
  name: 'MtdRadioButton',
  inheritAttrs: true,
  props: {
    value: {
      type: [String, Number, Boolean, Function, Object, Array, Symbol],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    name: String,
    size: {
      type: String,
      default: '',
    },
    label: [String, Number],
  },
  emits: ['input', 'change', 'click'],
  setup(props, ctx) {
    const { emit } = ctx
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('radio-button'))
    const useRadioGroupHook = useRadioGroup(props, ctx)

    const { _checked, _disabled, _size, setChecked, type } = useRadioGroupHook
    const wrapperCls = computed(() => {
      return [
        prefix.value,
        {
          [`${prefix.value}-checked`]: _checked.value,
          [`${prefix.value}-disabled`]: _disabled.value,
          [`${prefix.value}-${_size.value}`]: _size.value,
          [`${prefix.value}-${type.value}`]: type.value,
        },
      ]
    })

    const handleClick = ($event: Event) => {
      $event.preventDefault()
      if (_disabled.value) { return }
      if (!_checked.value) {
        setChecked(true)
      }
      emit('click', $event)
    }

    return {
      prefix,
      wrapperCls,
      handleClick,
      ...useRadioGroupHook,
    }
  },
  render() {
    const { prefix, wrapperCls, handleClick, _checked, _name, type } = this
    const { label } = this.$props

    return <label class={wrapperCls} onClick={handleClick}>
      <div class={`${prefix}-division`} v-show={type === 'slider'}></div>
      <input
        class={`${prefix}-input`}
        type="radio"
        checked={_checked}
        name={_name}
        style="display: none"
      />
      <span class={`${prefix}-inner`}>
        {this.$slots.default || label}
      </span>
    </label>
  },
})
