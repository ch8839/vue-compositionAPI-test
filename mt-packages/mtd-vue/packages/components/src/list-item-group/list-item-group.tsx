import {
  computed,
  defineComponent,
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
      {(this.$slots.header || header) &&
        <div class={`${prefix}-header`}>
          {this.$slots.header || header}
        </div>
      }
      {this.$slots.default}
    </div>
  },
})
