import {
  defineComponent,
  markRaw,
  nextTick,
  computed,
  reactive,
  toRefs,
  onMounted,
  ref,
  onUpdated,
  PropType,
  classNames,
  styles,
  useAllAttrs,
  getSlotsInRender,
  vueInstance,
  getChildInsList,
  useResetAttrs,
  useListeners,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import mitt from '@utils/mitt'
import TabNav from './base/tab-nav'
import { TabsType, TabPosition, ITabPane, ITabNav } from './types'

import { CPI } from '@components/types/component'

function getTabPanes(ins: CPI) {
  return getChildInsList(ins, ['TabDrop', 'TabPane'], {
    isFuzzyMatch: true,
  }) as ITabPane[]
}

export default defineComponent({
  name: 'MtdTabs',
  components: {
    TabNav,
  },
  inheritAttrs: false,
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    type: String as PropType<TabsType>,
    closable: Boolean,
    addable: Boolean,
    modelValue: [String, Number, Boolean, Array, Object],
    tabPosition: {
      type: String as PropType<TabPosition>,
      default: 'top',
    },
    size: {
      type: String,
      default: 'normal',
    },
    lineSize: Number,
    // position left 数量
    verticalHeightNumber: {
      type: Number,
      default: () => 1000,
    },
    showLine: {
      type: Boolean,
      default: true,
    },
    /*     style: Object as PropType<any>,
    class: [String, Array, Object], */
  },
  emits: [
    'tab-click',
    'tab-remove',
    'prev-click',
    'next-click',
    'tab-add',
    'input',
    'change',
    'update:modelValue',
  ],

  setup(props, ctx) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('tabs'))
    const allAttrs = useAllAttrs(ctx as any)
    const ins = vueInstance()

    const state = reactive({
      panes: [] as ITabPane[],
      tabStyle: {
        height: '',
      },
      emitter: markRaw(mitt()),
    })
    const navRef = ref<ITabNav | null>(null)

    const currentValue = computed((): any => props.modelValue)

    function calcPaneInstances(options?: { force: boolean }) {
      const panes = getTabPanes(ins)
      const changed = !(panes.length === state.panes.length &&
        panes.every((pane, index) => {
          return pane === state.panes[index]
        }))
      if (changed || (options && options.force)) {
        state.panes = panes
        const nav = navRef.value
        nav && nav.updateNav()
      }
    }

    /* Created */
    state.emitter.on(
      'tab-nav-update',
      calcPaneInstances.bind(null, { force: true }),
    )

    onMounted(() => {
      // 判断是否需要
      nextTick(() => {
        if (props.tabPosition === 'left' || props.tabPosition === 'right') {
          const { offsetHeight } = navRef.value ? navRef.value.$el as HTMLElement : { offsetHeight: 0 }
          state.tabStyle.height = offsetHeight + 'px'
        }
      })
      calcPaneInstances()
    })
    onUpdated(() => { calcPaneInstances() })

    /* Methods */
    function handleTabClick(event: Event, tab: any, tabValue: any) {
      if (tab && tab.disabled) {
        return
      }
      setValue(tabValue)
      ctx.emit('tab-click', event, tab)
    }
    function handleTabRemove(event: Event, pane: any) {
      if (pane.disabled) return
      event.stopPropagation()
      ctx.emit('tab-remove', event, pane.value)
    }
    function handlePrevClick(event: Event) {
      ctx.emit('prev-click', event)
    }
    function handleNextClick(event: Event) {
      ctx.emit('next-click', event)
    }
    function setValue(value: any) {
      if (props.modelValue !== value) {
        ctx.emit('input', value)
        ctx.emit('update:modelValue', value)
        ctx.emit('change', value)
      }
    }
    function addTabButton(event: Event) {
      ctx.emit('tab-add', event)
    }


    const tabNavData = useResetAttrs(ctx.attrs)
    const tabNavListeners = useListeners({
      tabClick: handleTabClick,
      tabRemove: handleTabRemove,
      prevClick: handlePrevClick,
      nextClick: handleNextClick,
    })

    return {
      prefix, allAttrs, currentValue, navRef, addTabButton,
      tabNavListeners, tabNavData,
      ...toRefs(state),
    }
  },

  render() {
    const {
      type,
      tabPosition,
      size,
      tabStyle,
      tabNavData,
      currentValue,
      lineSize,
      prefix,
      showLine,
      tabNavListeners,
      closable,
      addable,
      panes,
      verticalHeightNumber,
    } = this

    const borderStyle: Record<string, string> = {}
    if (!type) {
      if (tabPosition === 'top' || tabPosition === 'bottom') {
        borderStyle['height'] = lineSize ? `${lineSize}px` : ''
      } else {
        borderStyle['width'] = lineSize ? `${lineSize}px` : ''
      }
    }

    if (tabPosition !== 'top') {
      borderStyle['top'] = '0'
    }

    const nav = (
      <div class={[`${prefix}-nav`, tabPosition]}>
        <tab-nav
          {...tabNavData}
          currentValue={currentValue}
          closable={closable}
          addable={addable}
          type={type}
          panes={panes}
          {...tabNavListeners}
          size={size}
          lineSize={lineSize}
          tabPosition={tabPosition}
          verticalHeightNumber={verticalHeightNumber}
          ref="navRef">
        </tab-nav>
        {showLine && <div class={`${prefix}-bottom-border`} style={borderStyle}></div>}
      </div>
    )
    const panels = (
      <div class={`${prefix}-content`} ref="panesRef">
        {getSlotsInRender(this)}
      </div>
    )

    const $contentRender = (tabPosition === 'top' || tabPosition === 'left')
      ? [nav, panels]
      : [panels, nav]
    return (
      <div
        class={classNames(this, {
          [`${prefix}`]: true,
          [`${prefix}-nocard`]: !type,
          [`${prefix}-card`]: type === 'card',
          [`${prefix}-border-card`]: type === 'border-card',
          [`${prefix}-text`]: type === 'text',
          [`${prefix}-${tabPosition}`]: true,
          [`${prefix}-${size}`]: size,
        })}
        style={styles(this, tabStyle)}
        ref="tab"
      >
        {$contentRender}
      </div>
    )
  },
})
