import {
  defineComponent,
  computed,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { useRadioGroup } from '@components/radio-group/useRadioGroup'
import props from './props'

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

    const contextProps = useRadioGroup(props, ctx as any)
    const {
      m_checked, m_disabled, m_size, setChecked,
    } = contextProps

    const wrapperCls = computed(() => {
      return [
        prefix.value,
        {
          [`${prefix.value}-checked`]: m_checked.value,
          [`${prefix.value}-disabled`]: m_disabled.value,
          [`${prefix.value}-${m_size.value}`]: m_size.value,
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
      ...contextProps,
    }
  },
  render() {
    const { prefix, wrapperCls, handleClick, m_checked, m_name } = this
    const { label } = this.$props

    return <label class={wrapperCls} onClick={handleClick}
    ><input
        class={`${prefix}-input`}
        type="radio"
        checked={m_checked}
        name={m_name}
        style="display: none"
      /><span class={`${prefix}-inner`} /><span class={`${prefix}-text`}>
        {getSlotsInRender(this) || label}
      </span>
    </label>
  },
})
