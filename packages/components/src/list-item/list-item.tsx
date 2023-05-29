import {
  computed,
  defineComponent,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'

export default defineComponent({
  name: 'MtdListItem',
  inheritAttrs: true,
  emits: [],
  setup() {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('list-item'))
    return {
      prefix,
    }
  },
  render() {
    const { prefix } = this
    return <div class={prefix}>
      {getSlotsInRender(this)}
    </div>
  },
})
