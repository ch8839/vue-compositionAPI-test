
import MtdTooltip from '@components/tooltip'
import Link from './link'
import { useMenu } from '../menu/useMenu'
import {
  defineComponent,
  computed,
  watch,
  nextTick,
  reactive,
  markRaw,
  toRefs,
} from '@ss/mtd-adapter'
import useConfig from '@components/hooks/config'
import vueInstance from '@components/hooks/instance'
import mitt from '@utils/mitt'
import { useAttrs } from '@components/hooks/pass-through'
import { menuItemComp } from '@components/menu/types'

export default defineComponent({
  name: 'MtdMenuItem',
  components: {
    MtdTooltip,
    Link,
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
    const _tooltipProps = useAttrs(props.tooltipProps)
    const { menu, level, submenu, style, paddingLeft } = useMenu(self.ins)

    const active = computed(() => self.ins && menu.isActive(self.ins as menuItemComp))
    const isCollapse = computed(() => level.value === 0 && menu.isCollapse)
    const router = computed(() => menu.router || props.route)
    const link = computed(() =>
      router.value ? (menu.router ? props.name : props.route) : props.href,
    )
    const isShowIcon = computed(() => (props.icon || slots.icon) && !level.value)
    const tag = computed(() => (router.value ? 'router-link' : 'Link'))

    const others = useAttrs({
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
      _tooltipProps,
      active,
      enabledTooltip,
      placement,
      tag,
      style,
      level,
      others,
      handleClick,
      isCollapse,
      paddingLeft,
      isShowIcon,
      // submenu, 必须注释不然直接死循环
    }
  },

  render() {
    const {
      active, enabledTooltip, placement, tag, style, others, tooltip,
      handleClick, isCollapse, disabled, prefix, isShowIcon, icon,
      $slots, _tooltipProps,
    } = this
    const Component = tag

    const renderIcon = () => {
      return active
        ? ($slots.activeIcon || $slots.icon || <mtd-icon name={icon} />)
        : ($slots.icon || <mtd-icon name={icon} />)
    }

    return <mtd-tooltip
      {..._tooltipProps}
      disabled={!enabledTooltip}
      placement={placement}
    >
      <li
        class={{
          [prefix]: true,
          [`${prefix}-active`]: active,
          [`${prefix}-disabled`]: disabled,
        }}
        onClick={handleClick}
      >
        <Component
          style={style}
          class={`${prefix}-title`}
          {...others}
        >
          {isShowIcon && <span class={`${prefix}-icon`}>
            {renderIcon()}
          </span>}
          {!isCollapse && <span class={`${prefix}-text`}>{$slots.default}</span>}
        </Component>
      </li >
      <template slot="content">
        {tooltip
          ? <span>{{ tooltip }}</span>
          : $slots.default}
      </template>
    </mtd-tooltip >
  },
})
