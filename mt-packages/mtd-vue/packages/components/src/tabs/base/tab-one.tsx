import { useConfig } from '@components/config-provider'
import vueInstance from '@components/hooks/instance'
import {
  defineComponent, computed, ref, onUpdated, onMounted, classNames, styles,
} from '@ss/mtd-adapter'
import TabMore from './tab-more'
import MtdIcon from '@components/icon'
import { IPaneDrop, IPane, ITabNav } from '../types'

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
    const ins = vueInstance() as IPane

    const config = useConfig()
    const prefixTabs = computed(() => config.getPrefixCls('tabs'))
    const prefixTab = computed(() => config.getPrefixCls('tab'))

    const labelContent = ref(null)
    const iconhover = ref(false)
    const tabHover = ref(false)

    onMounted(() => { (ins.$parent as IPaneDrop)?.addTabs?.(ins) })
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
      labelContent,
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
    let tabMoreData = null
    $parent && ($parent.currentValue = currentValue)
    if (moreTabs && moreTabs.length) {
      tabMoreData = {
        props: {
          moreTabs,
          currentValue,
          label,
          icon,
          disabled,
          size,
        },
        on: {
          tabSelectClick: (value: any) => {
            if (value) {
              $parent.currentValue = value
              this.emitTabClick(value)
            }
          },
        },
        ref: 'more',
      }
    }
    // 如多每次都重新复制，会导致多次渲染问题
    // [Vue warn]: You may have an infinite update loop
    // in a component render function.

    // this.labelContent = this.labelContent || (
    //   <tab-more {...tabMoreData}></tab-more>
    // );
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
          {tabMoreData && <tab-more {...tabMoreData}></tab-more>}
          {!tabMoreData && icon &&
            <mtd-icon class={`${prefixTab}-icon`} name={icon}></mtd-icon>
          }
          <span>
            {!tabMoreData && (this.$slots.label || label)}
            <div class="width-skeleton">
              {!tabMoreData && (this.$slots.label || label)}
            </div>
          </span>
          {closable && (
            <mtd-icon
              class={`${prefixTabs}-tab-close`}
              name={iconhover ? 'error-circle' : 'closemini'}
              onClick={this.closeClick}
              onMouseenter={this.iconhoverenterEvent}
              onMouseleave={this.iconhoverleaveEvent}
            /* style={{
              visibility: tabHover ? 'visible' : 'hidden',
            }} */
            />
          )}
        </div>
      </div>
    )
  },
})
