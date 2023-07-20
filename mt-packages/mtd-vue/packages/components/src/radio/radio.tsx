import {
  defineComponent,
  computed,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { useRadioGroup } from '@components/radio-group/useRadioGroup'
import props from "./props"

export default defineComponent({
  name: 'MtdRadio',
  inheritAttrs: true,
  model: {
    prop: 'value',
    event: 'update:value',
  },
  props: props(),
  emits: ['input', 'change', 'click'],
  setup(props, ctx) {
    const { emit } = ctx
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('radio'))

    const contextProps = useRadioGroup(props, ctx)
    const {
      _checked, _disabled, _size, setChecked,
    } = contextProps

    const wrapperCls = computed(() => {
      return [
        prefix.value,
        {
          [`${prefix.value}-checked`]: _checked.value,
          [`${prefix.value}-disabled`]: _disabled.value,
          [`${prefix.value}-${_size.value}`]: _size.value,
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
      ...contextProps,
    }
  },
  render() {
    const { prefix, wrapperCls, handleClick, _checked, _name } = this
    const { label } = this.$props

    return <label class={wrapperCls} onClick={handleClick}
    ><input
        class={`${prefix}-input`}
        type="radio"
        checked={_checked}
        name={_name}
        style="display: none"
      /><span class={`${prefix}-inner`} /><span class={`${prefix}-text`}>
        {this.$slots.default || label}
      </span>
    </label>
  },
})
