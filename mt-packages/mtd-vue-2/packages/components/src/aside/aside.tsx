import {
  defineComponent,
  computed,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'

export default defineComponent({
  name: 'MtdAside',
  inheritAttrs: true,
  props: {
    width: {
      type: String,
      default: '300px',
    },
  },
  emits: [],
  setup() {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('aside'))
    return {
      prefix,
    }
  },
  render() {
    const {
      prefix, width,
    } = this
    return <aside class={prefix} style={{ width }}>
      {getSlotsInRender(this)}
    </aside>
  },
})
