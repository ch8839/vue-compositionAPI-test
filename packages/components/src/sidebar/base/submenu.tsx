import {
  defineComponent,
  getScopedSlotsInRender,
  vSlots,
} from '@ss/mtd-adapter'
import MenuItem from './menu-item'
import MtdSubmenu from '@components/submenu'
import MtdIcon from '@components/icon'

export default defineComponent({
  name: 'SidebarSubmenu',
  components: {
    MenuItem,
    MtdSubmenu,
    MtdIcon,
  },
  inheritAttrs: true,
  props: {
    item: {
      type: Object,
      required: true,
    },
    itemKey: {
      type: String,
      required: true,
    },
    tooltipProps: {
      type: Object,
    },
  },

  render() {
    const {
      tooltipProps, item, itemKey,
    } = this

    const slots = {
      icon: () => item.icon ? <MtdIcon name={item.icon} /> : undefined,
      title: () => getScopedSlotsInRender(this, 'title')?.({ item }) || item.title,
    }

    const childSlots = {
      title: getScopedSlotsInRender(this, 'title'),
      item: getScopedSlotsInRender(this, 'item'),
      default: getScopedSlotsInRender(this, 'item'),
    }

    return <mtd-submenu
      /* v-bind="$attrs" */
      name={item[itemKey]}
      tooltip={item.tooltip}
      tooltip-props={tooltipProps}
      {...vSlots(slots)}
      v-slots={slots}
    >
      {item.children.map((child: Record<string, any>) => {
        const Component = (child.children ? MtdSubmenu : MenuItem) as any
        return <Component
          item={child}
          key={child[itemKey]}
          item-key={itemKey}
          tooltip-props={tooltipProps}
          {...vSlots(childSlots)}
          v-slots={childSlots}
        >
        </Component>
      })
      }
    </mtd-submenu>
  },
})
