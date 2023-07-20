import { useConfig } from '@components/config-provider'
import {
  defineComponent, computed, ref, onUpdated, onMounted, classNames, styles, vueInstance,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import TabMore from './tab-more'
import MtdIcon from '@components/icon'
import { ITabDrop, ITabPane, ITabNav } from '../types'

export default defineComponent({
  name: 'MtdTabOne',
  components: {
    TabMore,
    MtdIcon,
  },
  inheritAttrs: false,
  props: {
    size: String,
    disabled: Boolean,
    active: Boolean,
    label: String,
    labelJsx: Array,
    pane: {
      type: Object,
      required: true,
    },
    //paneLabel: Function,
    icon: String,
    tabDropInfo: Object,
    currentValue: [String, Number, Object, Array],
    closable: Boolean,
  },
  emits: ['tabClick', 'tabRemove'],
  setup(props, { emit }) {
    const ins = vueInstance()!

    const config = useConfig()
    const prefixTabs = computed(() => config.getPrefixCls('tabs'))
    const prefixTab = computed(() => config.getPrefixCls('tab'))

    const iconhover = ref(false)
    const tabHover = ref(false)

    onMounted(() => { (ins.$parent as ITabDrop)?.addTabs?.(ins) })
    onUpdated(() => { (ins.$parent as ITabNav)?.repaint?.() })

    function emitTabClick(e: Event) {
      const value = !props.tabDropInfo
        ? props.pane.value
        : props.tabDropInfo.$parent.currentValue
      !props.disabled && emit('tabClick', e, value)
    }
    function handleClick(e: Event) {
      const { moreTabs } = props.tabDropInfo || {}
      if (!moreTabs || !moreTabs.length) {
        emitTabClick(e)
      }
    }
    function closeClick(e: Event) {
      !props.disabled && emit('tabRemove', e)
    }
    function iconhoverenterEvent() {
      iconhover.value = true
    }
    function iconhoverleaveEvent() {
      iconhover.value = false
    }
    function handleTabHover() {
      tabHover.value = true
    }
    function handleTabLeave() {
      tabHover.value = false
    }
    return {
      prefixTabs, prefixTab,
      iconhover,
      tabHover,
      emitTabClick,
      handleClick,
      closeClick,
      iconhoverenterEvent,
      iconhoverleaveEvent,
      handleTabHover,
      handleTabLeave,
    }
  },
  render() {
    const {
      size,
      disabled,
      active,
      icon,
      label,
      //paneLabel,
      tabDropInfo,
      currentValue,
      closable,
      iconhover,
      prefixTabs,
      prefixTab,
    } = this
    const { moreTabs, $parent } = tabDropInfo || {}
    let tabMoreListeners = {}

    $parent && ($parent.currentValue = currentValue)

    const showMoreTabs = moreTabs && moreTabs.length
    if (showMoreTabs) {
      tabMoreListeners = {
        tabSelectClick: (value: any) => {
          if (value) {
            $parent.currentValue = value
            this.emitTabClick(value)
          }
        },
      }
    }

    return (
      <div
        class={classNames(this, {
          [`${prefixTabs}-item`]: true,
          [`${prefixTabs}-item-${size}`]: true,
          [`${prefixTabs}-item-disabled`]: disabled,
          [`${prefixTab}-active`]: active,
          [`${prefixTabs}-closable`]: closable,
        })}
        style={styles(this)}
        onClick={this.handleClick}
        onMouseenter={this.handleTabHover}
        onMouseleave={this.handleTabLeave}
      >
        <div class={`${prefixTabs}-item-label`}>
          {showMoreTabs &&
            <tab-more
              moreTabs={moreTabs}
              currentValue={currentValue}
              label={label}
              icon={icon}
              disabled={disabled}
              size={size}
              on={tabMoreListeners}
              ref='more'>
            </tab-more>
          }
          {!showMoreTabs && icon &&
            <mtd-icon class={`${prefixTab}-icon`} name={icon}></mtd-icon>
          }
          <span>
            {!showMoreTabs && (getSlotsInRender(this, 'label') || label)}
            <div class="width-skeleton">
              {!showMoreTabs && (getSlotsInRender(this, 'label') || label)}
            </div>
          </span>
          {closable && (
            <mtd-icon
              class={`${prefixTabs}-tab-close`}
              name={iconhover ? 'error-circle' : 'closemini'}
              onClick={this.closeClick}
              onMouseenter={this.iconhoverenterEvent}
              onMouseleave={this.iconhoverleaveEvent}
            />
          )}
        </div>
      </div>
    )
  },
})
