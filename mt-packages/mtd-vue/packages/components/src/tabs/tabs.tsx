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
  PropType, classNames, styles,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import mitt from '@utils/mitt'
import TabNav from './base/tab-nav'
import { getChildInstanceList } from '@utils/vnode'
import { TabsType, TabPosition, IPane, ITabNav } from './types'
import vueInstance from '@components/hooks/instance'
import { useAllAttrs } from '@components/hooks/pass-through'
import { CPI } from '@components/types/component'

function getTabPanes(ins: CPI) {
  return getChildInstanceList(ins, ['MtdTabDrop', 'MtdTabPane']) as IPane[]
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
  ],

  setup(props, ctx) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('tabs'))
    const allAttrs = useAllAttrs(ctx)
    const ins = vueInstance()

    const state = reactive({
      panes: [] as IPane[],
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

    return {
      prefix, allAttrs, currentValue, navRef,
      ...toRefs(state),
    }
  },

  methods: {
    handleTabClick(event: Event, tab: any, tabValue: any) {
      if (tab && tab.disabled) {
        return
      }
      this.setValue(tabValue)
      this.$emit('tab-click', event, tab)
    },
    handleTabRemove(event: Event, pane: any) {
      if (pane.disabled) return
      event.stopPropagation()
      this.$emit('tab-remove', event, pane.value)
    },
    handlePrevClick(event: Event) {
      this.$emit('prev-click', event)
    },
    handleNextClick(event: Event) {
      this.$emit('next-click', event)
    },
    setValue(value: any) {
      if (this.modelValue !== value) {
        this.$emit('input', value)
        this.$emit('update:modelValue', value)
        this.$emit('change', value)
      }
    },
    addTabButton(event: Event) {
      this.$emit('tab-add', event)
    },
  },

  render() {
    const {
      type,
      currentValue,
      panes,
      closable,
      addable,
      tabPosition,
      size,
      allAttrs,
      verticalHeightNumber,
      tabStyle,
      lineSize,
      prefix,
      showLine,
    } = this
    const navData = {
      ref: 'navRef',
      ...allAttrs,
      props: {
        currentValue,
        closable,
        addable,
        type,
        panes,
        size,
        lineSize,
        tabPosition,
        verticalHeightNumber,
      },
      on: {
        tabClick: this.handleTabClick,
        tabRemove: this.handleTabRemove,
        prevClick: this.handlePrevClick,
        nextClick: this.handleNextClick,
      },
    }

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
        <tab-nav {...navData} ref="navRef"></tab-nav>
        {showLine && <div class={`${prefix}-bottom-border`} style={borderStyle}></div>}
      </div>
    )
    const panels = (
      <div class={`${prefix}-content`} ref="panesRef">
        {this.$slots.default}
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
