import useConfig from '@hooks/config'
import {
  defineComponent,
} from '@ss/mtd-adapter'

export default defineComponent({
  name: 'MtdButtonGroup',
  inheritAttrs: true,
  setup() {
    const config = useConfig()
    const prefix = config.getPrefixCls('btn-group')
    return {
      prefix,
    }
  },
  render() {
    const { prefix } = this
    return <div class={prefix}>{this.$slots.default}</div>
  },
})
