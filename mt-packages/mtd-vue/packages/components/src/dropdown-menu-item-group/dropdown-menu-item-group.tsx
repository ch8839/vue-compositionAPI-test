import {
  computed,
  defineComponent,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'

export default defineComponent({
  name: 'MtdDropdownMenuItemGroup',
  inheritAttrs: true,
  props: {
    header: {
      type: String,
    },
  },
  slots: ['header'],
  emits: [],
  setup() {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('dropdown-menu-item-group'))
    return {
      prefix,
    }
  },
  render() {
    const { prefix, header } = this
    return <div class={prefix}>
      {(getSlotsInRender(this, 'header') || header) &&
        <div class={`${prefix}-title`}>
          {getSlotsInRender(this, 'header') || header}
        </div>
      }
      {getSlotsInRender(this)}
    </div>
  },
})
