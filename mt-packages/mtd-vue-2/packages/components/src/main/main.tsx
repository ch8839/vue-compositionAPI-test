import {
  defineComponent,
  computed,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'

export default defineComponent({
  name: 'MtdMain',
  inheritAttrs: true,
  setup() {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('main'))
    return {
      prefix,
    }
  },
  render() {
    const {
      prefix,
    } = this
    return <main class={prefix}>
      {getSlotsInRender(this)}
    </main>
  },
})
