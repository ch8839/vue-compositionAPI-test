import {
  defineComponent,
  computed,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { useRadioGroup } from '@components/radio-group/useRadioGroup'

export default defineComponent({
  name: 'MtdRadioButton',
  inheritAttrs: true,
  props: {
    value: {
      type: [String, Number, Boolean, Function, Object, Array],
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
    const useRadioGroupHook = useRadioGroup(props, ctx as any)

    const { m_checked, m_disabled, m_size, setChecked, type } = useRadioGroupHook
    const wrapperCls = computed(() => {
      return [
        prefix.value,
        {
          [`${prefix.value}-checked`]: m_checked.value,
          [`${prefix.value}-disabled`]: m_disabled.value,
          [`${prefix.value}-${m_size.value}`]: m_size.value,
          [`${prefix.value}-${type.value}`]: type.value,
        },
      ]
    })

    const handleClick = ($event: Event) => {
      $event.preventDefault()
      if (m_disabled.value) { return }
      if (!m_checked.value) {
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
    const { prefix, wrapperCls, handleClick, m_checked, m_name, type } = this
    const { label } = this.$props

    return <label class={wrapperCls} onClick={handleClick}>
      <div class={`${prefix}-division`} v-show={type === 'slider'}></div>
      <input
        class={`${prefix}-input`}
        type="radio"
        checked={m_checked}
        name={m_name}
        style="display: none"
      />
      <span class={`${prefix}-inner`}>
        {getSlotsInRender(this) || label}
      </span>
    </label>
  },
})
