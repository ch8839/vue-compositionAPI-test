import useConfig from '@hooks/config'
import { defineComponent, provide, computed, inject, getSlotsInRender } from '@ss/mtd-adapter'
import ProvideSymbol from './symbol'
import { RowProvide } from './types'

export function useRowProvide(gutter?: number) {
  provide<RowProvide>(ProvideSymbol, { gutter: gutter })
}

export function useRowContext() {
  return inject<RowProvide>(ProvideSymbol)
}

export default defineComponent({
  name: 'MtdRow',
  inheritAttrs: true,
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    gutter: Number,
    type: String,
    justify: {
      type: String,
      default: 'start',
    },
    align: {
      type: String,
      default: 'top',
    },
  },
  setup(props) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('row'))
    useRowProvide(props.gutter)
    return {
      prefix,
    }
  },
  render() {
    const { prefix, tag, justify, align, type } = this
    const Component = tag
    return <Component
      class={[
        prefix,
        justify !== 'start' ? `${prefix}-justify-${justify}` : '',
        align !== 'top' ? `${prefix}-align-${align}` : '',
        { [`${prefix}-flex`]: type === 'flex' },
      ]}
    >
      {getSlotsInRender(this)}
    </Component>
  },
})
