
import MtdCollapseTransition from '@components/transitions/collapse-transition'
import DropdownMenu from './drop'
import MtdTooltip from '@components/tooltip'
import MtdIcon from '@components/icon'
import {
  defineComponent,
  provide,
  reactive,
  computed,
  onUnmounted,
  ComponentPublicInstance,
  ComputedRef,
  markRaw,
  toRefs,
  watch,
} from '@ss/mtd-adapter'
import mitt from '@utils/mitt'
import { useMenu } from '../menu/useMenu'
import useConfig from '@components/hooks/config'
import vueInstance from '@components/hooks/instance'
import { useAttrs } from '@components/hooks/pass-through'

export default defineComponent({
  name: 'MtdSubmenu',
  components: {
    MtdCollapseTransition,
    DropdownMenu,
    MtdTooltip,
    MtdIcon,
  },
  inheritAttrs: true,
  props: {
    icon: String,
    name: [Number, String],
    disabled: Boolean,
    closeDelay: {
      type: Number,
      default: 100,
    },
    openDelay: {
      type: Number,
      default: 0,
    },
    tooltip: String,
    tooltipProps: Object,
    popperClass: String,
  },
  setup(props, { slots }) {
    const config = useConfig()
    const self = reactive({
      prefix: config.getPrefixCls('submenu'),
      ins: vueInstance(),
      emitter: markRaw(mitt()),
    })
    const _tooltipProps = useAttrs(props.tooltipProps)
    const { menu, submenu, level, style, paddingLeft } = useMenu(self.ins)
    provide('submenu', self.ins)

    const state = reactive({
      showDropdown: false,
      childActive: false,
      activeChild: null,
      animating: true,
    })

    const isCollapse = computed(() => menu.isCollapse)
    const isExpanded = computed(() => menu.isExpanded(self.ins))
    const isShowIcon = computed(() => (props.icon || slots.icon) && !level.value)

    // use 决定submenu 是否高亮
    const active = computed(() => {
      if (level.value === 0 && (menu.mode !== 'inline' || isCollapse.value)) {
        return state.childActive
      } else {
        return state.childActive && (isPopup.value || (!isExpanded.value))
      }
    })
    watch(isExpanded, () => {

    }, { immediate: true })

    const isPopup: ComputedRef<boolean> = computed(
      () => isCollapse.value || menu.mode !== 'inline',
    )

    const isClickTrigger = computed(() => !isPopup.value)

    const dropdownPlacement = computed(() =>
      level.value === 0 && menu.mode === 'horizontal' ? 'bottom' : 'right-start',
    )

    const tooltipPlacement = computed(() => {
      if (!props.tooltipProps) {
        return 'right'
      }
      return props.tooltipProps.placement || 'right'
    })

    const enabledTooltip = computed(
      () => !!props.tooltip && menu.mode !== 'horizontal',
    )

    const handleChildActiveChange = (item: ComponentPublicInstance<any>) => {
      if (item.active) {
        state.childActive = true
        state.activeChild = item
        submenu?.emitter?.emit('activeChange', item)
      } else if (state.activeChild && (state.activeChild as any).name === (item as any).name) {
        state.childActive = false
        state.activeChild = null
        submenu?.emitter?.emit('activeChange', item)
      }
    }

    let timer = 0
    const clearTimer = () => {
      timer && clearTimeout(timer)
    }
    onUnmounted(clearTimer)

    const handleMouseenter = () => {
      if (isClickTrigger.value || props.disabled) return
      clearTimer()
      if (!isExpanded.value) {
        timer = setTimeout(() => {
          menu.toggleExpanded(self.ins)
        }, props.openDelay)
      }
    }

    const handleMouseleave = () => {
      if (isClickTrigger.value || props.disabled) return
      clearTimer()
      timer = setTimeout(() => {
        if (isExpanded.value) {
          menu.toggleExpanded(self.ins)
        }
      }, props.closeDelay)
    }

    const closePopup = () => {
      if (level.value === 0) {
        handleMouseleave()
      }
    }

    const handleMenuItemClick = () => {
      closePopup()
      if (submenu) {
        submenu.emitter.emit('menuItemClick', this)
      }
    }

    const handleClickTitle = () => {
      if (props.disabled) return
      if (isPopup.value) {
        // 当处于需要展开菜单的模式时;
        if (!isClickTrigger.value) return
        if (isCollapse.value || isPopup.value) {
          state.showDropdown = !state.showDropdown
        }
        return
      }
      // 不处于需要展开菜单的模式时才触发; 🤡
      if (isCollapse.value) {
        (menu as any).toggleCollapse()
      }
      menu.toggleExpanded(self.ins)
    }

    self.emitter.on('activeChange', handleChildActiveChange)
    self.emitter.on('menuItemClick', handleMenuItemClick)

    return {
      ...toRefs(self),
      ...toRefs(state),
      // submenu,
      isExpanded,
      active,
      handleMouseenter,
      handleMouseleave,
      enabledTooltip,
      tooltipPlacement,
      style,
      handleClickTitle,
      level,
      isCollapse,
      isPopup,
      dropdownPlacement,
      clearTimer,
      closePopup,
      paddingLeft,
      _tooltipProps,
      isShowIcon,
    }
  },
  render() {
    const {
      prefix, disabled, isExpanded, active, _tooltipProps, enabledTooltip, tooltip, tooltipPlacement,
      style, icon, $slots, level, isCollapse, isPopup, dropdownPlacement, popperClass, isShowIcon, childActive,
      handleMouseenter, handleMouseleave, handleClickTitle, clearTimer, closePopup,
    } = this

    const renderIcon = () => {
      return childActive
        ? ($slots.activeIcon || $slots.icon || <mtd-icon name={icon} />)
        : ($slots.icon || <mtd-icon name={icon} />)
    }

    return <li
      class={[prefix, {
        [`${prefix}-disabled`]: disabled,
        [`${prefix}-expanded`]: isExpanded,
        [`${prefix}-child-active`]: childActive,
        [`${prefix}-active`]: active,
      }]}
      onMouseenter={handleMouseenter}
      onMouseleave={handleMouseleave}
    >

      <mtd-tooltip
        {..._tooltipProps}
        disabled={!enabledTooltip}
        content={tooltip}
        placement={tooltipPlacement}
        showArrow={false}
      >
        <div class={`${prefix}-title`}
          style={style}
          onClick={handleClickTitle}
        >
          {isShowIcon &&
            <div class={`${prefix}-icon`} >
              {renderIcon()}
            </div>
          }
          {(level !== 0 || !isCollapse) && <div class={`${prefix}-text`}>
            {$slots.title}
          </div>}
          <mtd-icon
            name="down-thick"
            class={[`${prefix}-direction`, {
              [`${prefix}-direction-expanded`]: isExpanded,
            }]}
          />
        </div >
        <div slot="content">{tooltip}</div>
      </mtd-tooltip>
      {!isPopup && <mtd-collapse-transition>
        {<ul class={`${prefix}-content`} v-show={isExpanded}>
          {this.$slots.default}
        </ul>}
      </mtd-collapse-transition>}
      {isPopup && <dropdown-menu
        showArrow={false}
        visible={isExpanded}
        disabled={disabled}
        placement={dropdownPlacement}
        level={level}
        popper-class={popperClass}
        onMouseenter={clearTimer}
        onMouseleave={closePopup}
        ref={'dropRef'}
      >
        {this.$slots.default}
      </dropdown-menu>}
    </li >
  },
})
