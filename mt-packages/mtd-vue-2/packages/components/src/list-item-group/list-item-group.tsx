import {
  computed,
  defineComponent,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'

export default defineComponent({
  name: 'MtdListItemGroup',
  inheritAttrs: true,
  props: {
    header: {
      type: String,
    },
  },
  emits: [],
  setup() {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('list-item-group'))
    return {
      prefix,
    }
  },
  render() {
    const { prefix, header } = this
    return <div class={prefix}>
      {(getSlotsInRender(this, 'header') || header) &&
        <div class={`${prefix}-header`}>
          {getSlotsInRender(this, 'header') || header}
        </div>
      }
      {getSlotsInRender(this)}
    </div>
  },
})
