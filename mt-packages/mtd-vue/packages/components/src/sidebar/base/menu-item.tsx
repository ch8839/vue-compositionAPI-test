import {
  defineComponent,
  PropType,
  computed,
} from '@ss/mtd-adapter'
import { SidebarData } from '../types'
import { useAttrs } from '@components/hooks/pass-through'
import MtdMenuItem from '@components/menu-item'
export default defineComponent({
  name: 'SidebarMenuItem',
  components: {
    MtdMenuItem,
  },
  props: {
    /**
     * @param {Object} item
     * @param {Router} route 路由跳转信息，详细请查看 route-link to 属性
     * @param {string} href 同 a 标签 href 属性
     */
    item: {
      type: Object as PropType<SidebarData>,
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
  emits: [],
  setup(props) {
    const menuItemAttrs = computed(() => {
      const item = props.item
      const itemKey = props.itemKey

      const attrs = useAttrs({
        name: item[itemKey],
        href: item.href,
        route: item.route,
        replace: item.replace,
        target: item.target,
        rel: item.rel,
        disabled: item.disabled,
        'active-class': item['active-class'],
        'exact-active-class': item['exact-active-class'],
        exact: item.exact,
      })
      return attrs.value
    })

    const computedCollection = {
      menuItemAttrs,
    }


    return {
      ...computedCollection,
    }

  },
  render() {

    const {
      menuItemAttrs, tooltipProps, item,
    } = this

    return <mtd-menu-item
      {...menuItemAttrs}
      tooltip-props={tooltipProps}
      tooltip={item.tooltip}
    >
      {item.icon &&
        <template slot="icon" >
          <i class={item.icon} />
        </template>
      }
      {this.$slots.item || item.title}
    </mtd-menu-item>
  },
})
