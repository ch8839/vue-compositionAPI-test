import { defineComponent, getSlotsInRender } from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { useBreadcrumb } from './breadcrumb'
import { createError } from '@utils/log'
import DropdownMenu from '@components/dropdown-menu'
import Dropdown from '@components/dropdown'
import MtdIcon from '@components/icon'

export default defineComponent({
  name: 'MtdBreadcrumbItemGroup',
  components: {
    DropdownMenu,
    Dropdown,
    MtdIcon,
  },
  inheritAttrs: true,
  props: {
    text: {
      type: String,
      default: '...',
    },
  },
  setup() {
    const config = useConfig()
    const prefix = config.getPrefixCls('breadcrumb-item-group')
    const breadcrumb = useBreadcrumb()
    if (!breadcrumb) {
      throw createError('MtdBreadcrumbItemGroup', 'MtdBreadcrumbItemGroup must be used in MtdBreadcrumb')
    }
    return {
      separator: breadcrumb.separator,
      separatorClass: breadcrumb.separatorClass,
      breadcrumbPrefix: breadcrumb.breadcrumbPrefix,
      prefix,
      getIconCls: config.getIconCls,
    }
  },
  render() {
    const {
      text, prefix,
      separatorClass, separator,
      breadcrumbPrefix,
    } = this

    const children = <span class={`${breadcrumbPrefix}-inner`}>
      {this.$slots.text || text}
    </span>

    return (
      <span class={[`${prefix}`]}>
        <Dropdown>
          {children}
          <template slot="dropdown">
            <DropdownMenu>{getSlotsInRender(this)}</DropdownMenu>
          </template>
        </Dropdown>
        <span class={[`${breadcrumbPrefix}-separator`, separatorClass]}>
          {separator || <mtd-icon name="slash" />}
        </span>
      </span>
    )
  },
})
