import {
  defineComponent,
} from '@ss/mtd-adapter'
import MenuItem from './menu-item'
import MtdSubmenu from '@components/submenu'

export default defineComponent({
  name: 'SidebarSubmenu',
  components: {
    MenuItem,
    MtdSubmenu,
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

    return <mtd-submenu
      /* v-bind="$attrs" */
      name={item[itemKey]}
      tooltip={item.tooltip}
      tooltip-props={tooltipProps}
    >
      {/* icon 插槽 */}
      {item.icon &&
        <template slot="icon">
          <i class={item.icon} />
        </template>
      }

      {/* title 插槽 */}
      <template slot="title">
        {this.$scopedSlots.title?.(item) || item.title}
      </template>

      {item.children.map((child: Record<string, any>) => {
        const Component = child.children ? 'mtd-submenu' : 'menu-item'
        return <Component
          item={child}
          key={child[itemKey]}
          item-key={itemKey}
          tooltip-props={tooltipProps}
          scopedSlots={{ // v-slots
            title: this.$scopedSlots.title ? (scope: any) => {
              return this.$scopedSlots.title?.(scope)
            } : undefined,
            item: this.$slots.item ? (scope: any) => {
              return this.$scopedSlots.item?.(scope)
            } : undefined,
            default: this.$slots.item ? (scope: any) => {
              return this.$scopedSlots.item?.(scope)
            } : undefined,
          }}
        >
        </Component>
      })
      }
    </mtd-submenu>
  },
})
