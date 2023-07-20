import {
  defineComponent,
  computed,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { useCheckboxGroup } from '@components/checkbox-group/useCheckboxGroup'
import MtdIcon from '@components/icon'
import props from './props'

export default defineComponent({
  name: 'MtdCheckbox',
  components: {
    MtdIcon,
  },
  inheritAttrs: true,
  model: {
    prop: 'value',
    event: 'update:value',
  },
  props: props(),
  emits: ['input', 'change', 'click', 'update:value'], // click 内部使用不暴露
  setup(props, ctx) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('checkbox'))

    const groupContext = useCheckboxGroup(props, ctx as any)
    const { checked, m_disabled, m_size, changeChecked } = groupContext
    const wrapperCls = computed((): Object => {
      return [
        prefix.value,
        {
          [`${prefix.value}-checked`]: checked.value,
          [`${prefix.value}-disabled`]: m_disabled.value,
          [`${prefix.value}-${m_size.value}`]: m_size.value,
          [`${prefix.value}-indeterminate`]: props.indeterminate,
        },
      ]
    })

    const handleChange = () => {
      if (!m_disabled.value) {
        changeChecked()
      }
    }

    const handleClick = (e: Event) => {
      ctx.emit('click', e)
    }

    return {
      prefix,
      wrapperCls,
      handleChange,
      handleClick,
      ...groupContext,
    }
  },
  render() {
    const { prefix, wrapperCls, handleChange, checked, m_name, m_disabled, handleClick } = this
    const { label, indeterminate } = this.$props

    return <label class={wrapperCls} onClick={handleClick}>
      <input
        class={`${prefix}-input`}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        name={m_name}
        disabled={m_disabled}
        style="display: none;"
      />
      <span class={`${prefix}-inner`}>
        {indeterminate
          ? <i class={`${prefix}-indeterminate-inner`} />
          : <MtdIcon name="check-thick" v-show={checked} />}
      </span>
      {getSlotsInRender(this) && <span class={`${prefix}-text`}>
        {getSlotsInRender(this) || label}
      </span>}
    </label>
  },
})
