import {
  defineComponent,
  computed,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'

export default defineComponent({
  name: 'MtdHeader',
  inheritAttrs: true,
  props: {
    height: {
      type: String,
      default: '60px',
    },
  },
  emits: [],
  setup() {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('header'))
    return {
      prefix,
    }
  },
  render() {
    const {
      prefix, height,
    } = this
    return <header class={prefix} style={{ height }}>
      {getSlotsInRender(this)}
    </header>
  },
})
