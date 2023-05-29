import {
  defineComponent,
  computed,
  Fragment, classNames, styles,
  getSlotsInRender,
  getScopedSlotsInRender,
  vSlots,
  useResetAttrs,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import MtdMenu from '@components/menu'
import Submenu from './base/submenu'
import MenuItem from './base/menu-item'
import useSidebar from './useSideBar'
import { SidebarData } from './types'
import sideBarProps from './props'
import MtdIcon from '@components/icon'

export default defineComponent({
  name: 'MtdSidebar',
  components: {
    MtdMenu,
    Submenu,
    MenuItem,
    MtdIcon,
  },
  inheritAttrs: false,
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: sideBarProps(),
  emits: [
    'update:collapse',
    'collapse-change',
    'update:modelValue',
    'update:expandKeys',
    'menu-item-click',
    'menu-expand-change',
  ],
  setup(props, ctx) {
    const { emit } = ctx
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('sidebar'))
    const prefixMTD = computed(() => config.getPrefix())

    const useSidebarHook = useSidebar(props, ctx as any)

    const menuAttrs = useResetAttrs(ctx.attrs)

    // @Function
    function toggle() {
      const flag = !useSidebarHook.m_collapse.value
      useSidebarHook.updateCollapse(flag)

      emit('collapse-change', flag)
    }
    function getItem(key: string) {
      let result: any = null
      const { itemKey } = props
      function flat(item: SidebarData) {
        if (item[itemKey] === key) {
          result = item
          return true
        } else if (item.children) {
          item.children.some(flat)
        }
      }
      props.data!.some(flat)
      return result
    }
    function handleMenuItemActive(key: string) {
      useSidebarHook.updateActiveKey(key)
      const item = getItem(key)
      emit('menu-item-click', { key, item })
    }
    function handleExpandChange(
      keys: string[],
      extra: { name: string; expanded: boolean },
    ) {
      useSidebarHook.updateExpandKeys(keys)
      const { name, expanded } = extra
      const item = getItem(extra.name)
      emit('menu-expand-change', {
        item,
        expandKeys: keys,
        key: name,
        expanded,
      })
    }

    const functionCollection = {
      toggle, getItem, handleMenuItemActive, handleExpandChange,
    }

    return {
      prefix, menuAttrs, prefixMTD,
      ...useSidebarHook,
      ...functionCollection,
    }
  },
  render() {
    const {
      prefix, prefixMTD, m_collapse, m_value, m_expandKeys, theme, title, accordion, tooltipProps, itemKey,
      data, menuAttrs,
    } = this

    const menuListeners = {
      ['expand-change']: this.handleExpandChange,
      ['update:modelValue']: this.handleMenuItemActive,
    }

    const submenuSlots = {
      title: getScopedSlotsInRender(this, 'submenu'),
      item: getScopedSlotsInRender(this, 'item'),
    }

    const menuItemSlots = {
      default: getScopedSlotsInRender(this, 'item'),
    }

    return <div
      class={classNames(this, {
        [prefix]: true,
        [prefix + '-collapse']: m_collapse,
        [`${prefix}-${theme}`]: theme,
      })}
      style={styles(this)}
    >
      {/* 头部 */}
      <div class={`${prefix}-header`}>
        <span class={`${prefix}-header-title`}>
          {getSlotsInRender(this, 'title') || title}
        </span>
        <span class={`${prefix}-header-icon`} onClick={this.toggle}>
          <mtd-icon name={m_collapse ? 'expand' : 'collapse'} class={`${prefixMTD}-menu-title-backward`} />
        </span>
      </div>

      {/* 主题 */}
      <div class={`${prefix}-menus`}>
        {getSlotsInRender(this, 'menu') ||
          <mtd-menu
            {...menuAttrs}
            theme={theme}
            modelValue={m_value}
            default-expanded-names={m_expandKeys}
            collapse={m_collapse}
            accordion={accordion}
            on={menuListeners}
            tooltip-props={tooltipProps}
            item-key={itemKey}
          >
            {data?.map(item => <Fragment>
              {item.children
                ? <submenu
                  item-key={itemKey}
                  item={item}
                  key={item[itemKey]}
                  tooltip-props={tooltipProps}
                  {...vSlots(submenuSlots)}
                  v-slots={submenuSlots}
                >
                </submenu>
                : <menu-item
                  item={item}
                  key={item[itemKey]}
                  item-key={itemKey}
                  tooltip-props={tooltipProps}
                  {...vSlots(menuItemSlots)}
                  v-slots={menuItemSlots}
                >
                </menu-item>
              }
            </Fragment>)}
          </mtd-menu>
        }
      </div>
    </div >
  },
})
