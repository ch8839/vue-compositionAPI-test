import {
  defineComponent,
  computed,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { useCheckboxGroup } from '@components/checkbox-group/useCheckboxGroup'
import Icon from '@components/icon'
import props from "./props"

export default defineComponent({
  name: 'MtdCheckbox',
  inheritAttrs: true,
  model: {
    prop: 'value',
    event: 'update:value',
  },
  props: props(),
  emits: ['input', 'change'],
  setup(props, ctx) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('checkbox'))

    const groupContext = useCheckboxGroup(props, ctx)
    const { checked, _disabled, _size, changeChecked } = groupContext
    const wrapperCls = computed((): Object => {
      return [
        prefix.value,
        {
          [`${prefix.value}-checked`]: checked.value,
          [`${prefix.value}-disabled`]: _disabled.value,
          [`${prefix.value}-${_size.value}`]: _size.value,
          [`${prefix.value}-indeterminate`]: props.indeterminate,
        },
      ]
    })

    const handleChange = () => {
      if (!_disabled.value) {
        changeChecked()
      }
    }
    return {
      prefix,
      wrapperCls,
      handleChange,
      ...groupContext,
    }
  },
  render() {
    const { prefix, wrapperCls, handleChange, checked, _name, _disabled } = this
    const { label, indeterminate } = this.$props

    return <label class={wrapperCls}>
      <input
        class={`${prefix}-input`}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        name={_name}
        disabled={_disabled}
        style="display: none;"
      />
      <span class={`${prefix}-inner`}>
        {indeterminate
          ? <i class={`${prefix}-indeterminate-inner`} />
          : <Icon name="check-thick" v-show={checked} />}
      </span>
      {this.$slots.default && <span class={`${prefix}-text`}>
        {this.$slots.default || label}
      </span>}
    </label>
  },
})
