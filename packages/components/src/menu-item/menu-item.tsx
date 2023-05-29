
import MtdTooltip from '@components/tooltip'
import MenuItemLink from './link'
import { useMenu } from '../menu/useMenu'
import {
  defineComponent,
  computed,
  watch,
  nextTick,
  reactive,
  markRaw,
  toRefs,
  useResetAttrs,
  getSlotsInRender,
  vueInstance,
  vSlots,
} from '@ss/mtd-adapter'
import useConfig from '@components/hooks/config'
import MtdIcon from '@components/icon'
import mitt from '@utils/mitt'

export default defineComponent({
  name: 'MtdMenuItem',
  components: {
    MtdTooltip,
    MenuItemLink,
    MtdIcon,
  },
  inheritAttrs: true,
  props: {
    name: {
      type: [String, Number],
      required: true,
    },
    icon: String,
    route: [String, Object],
    href: String,
    disabled: Boolean,
    tooltipProps: {
      type: Object,
    },
    tooltip: String,
  },
  setup(props, { attrs, slots }) {
    const config = useConfig()
    const self = reactive({
      prefix: config.getPrefixCls('menu-item'),
      ins: vueInstance(),
      emitter: markRaw(mitt()),
    })
    const m_tooltipProps = useResetAttrs(props.tooltipProps)
    const { menu, level, submenu, style, paddingLeft } = useMenu(self.ins)

    const active = computed(() => self.ins && menu.isActive(self.ins))
    const isCollapse = computed(() => level.value === 0 && menu.isCollapse)
    const router = computed(() => menu.router || props.route)
    const link = computed(() =>
      router.value ? (menu.router ? props.name : props.route) : props.href,
    )
    const isShowIcon = computed(() => (props.icon || slots.icon)) //  && !level.value

    const others = useResetAttrs({
      ...attrs,
      disabled: props.disabled ? 'disabled' : undefined,
      [router.value ? 'to' : 'href']: link.value,
    })

    const enabledTooltip = computed(
      () =>
        !props.disabled &&
        (isCollapse.value || (!!props.tooltip && menu.mode !== 'horizontal')),
    )

    const placement = computed(() => props?.tooltipProps?.placement ?? 'right')

    const emitActive = () => {
      submenu && submenu.emitter.emit('activeChange', self.ins)
    }

    const handleClick = () => {
      if (props.disabled) return
      menu.emitter.emit('menuItemClick', self.ins)
      submenu && submenu.emitter.emit('menuItemClick', self.ins)
    }

    watch(active, emitActive)

    if (active.value) {
      nextTick(emitActive)
    }
    return {
      ...toRefs(self),
      m_tooltipProps,
      active,
      enabledTooltip,
      placement,
      style,
      level,
      others,
      handleClick,
      isCollapse,
      paddingLeft,
      isShowIcon,
      router,
      submenu: submenu && {
        name: submenu.name,
      },
    }
  },

  render() {
    const {
      active, enabledTooltip, placement, style, others, tooltip, router,
      handleClick, isCollapse, disabled, prefix, isShowIcon, icon, m_tooltipProps,
    } = this

    const renderIcon = () => {
      return active
        ? (getSlotsInRender(this, 'activeIcon') || getSlotsInRender(this, 'icon') || <MtdIcon name={icon} />)
        : (getSlotsInRender(this, 'icon') || <MtdIcon name={icon} />)
    }

    const slots = {
      content: () => tooltip ? <span>{{ tooltip }}</span> : getSlotsInRender(this),
    }

    return <mtd-tooltip
      {...m_tooltipProps}
      disabled={!enabledTooltip}
      placement={placement}
      {...vSlots(slots)}
      v-slots={slots}
    >
      <li
        class={{
          [prefix]: true,
          [`${prefix}-active`]: active,
          [`${prefix}-disabled`]: disabled,
        }}
        onClick={handleClick}
      >
        <menu-item-link
          router={!!router}
          style={style}
          class={`${prefix}-title`}
          {...others}
        >
          {isShowIcon && <span class={`${prefix}-icon`}>
            {renderIcon()}
          </span>}
          {!isCollapse && <span class={`${prefix}-text`}>{getSlotsInRender(this)}</span>}
        </menu-item-link>
      </li >
    </mtd-tooltip >
  },
})
