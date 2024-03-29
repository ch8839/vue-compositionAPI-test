import {
  defineComponent,
  PropType,
} from '@ss/mtd-adapter'

import {
  useConfigProvider,
} from './hooks'

// skip undefined prop merged and return new object.
function combine(option1: any, option2: any) { // eslint-disable-line
  const option = { ...option1 }
  Object.keys(option2).forEach((key) => {
    const value = option2[key]
    if (value !== undefined) {
      option[key] = value
    }
  })
  return option
}

export default defineComponent({
  name: 'MtdConfigProvider',
  props: {
    prefixCls: String,
    iconPrefixCls: String,
    tag: {
      type: String,
      default: 'div',
    },
    getPopupContainer: Function as PropType<() => HTMLElement>,
  },
  setup(props) {
    const config = useConfigProvider(props)
    return { config }
  },
  render() {
    const { tag, prefixCls } = this

    return (
      <div is={tag} class={`${prefixCls}-config-provider`}>
        {this.$slots.default}
      </div>
    )
  },
})
