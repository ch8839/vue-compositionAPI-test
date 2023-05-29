import {
  defineComponent, reactive, toRefs, onMounted, onUpdated, classNames, styles, getSlotsInRender, getChildInsList, vueInstance, computed,
} from '@ss/mtd-adapter'

export default defineComponent({
  name: 'MtdTabDrop',
  inheritAttrs: false,
  props: {
    label: String,
    disabled: Boolean,
  },
  setup(props, { slots }) {

    const state = reactive({
      value: undefined, // unused
      icon: undefined, // unused
      currentValue: '',
      tabDropInfo: {
        moreTabs: [] as any[],
        $parent: null,
      },
      IS_TAB_DROP: true, // 用来标记这个组件是tab-drop，宏定义
    })

    const ins = vueInstance()

    const active = computed(() => {
      return state.tabDropInfo.moreTabs.some((it) => {
        return state.currentValue === it.value
      })
    })

    // 获取 item ins
    const getTabPaneInstanceList = () => {
      return getChildInsList(ins, ['MtdTabPane'])
    }

    // 💣 该函数vue2/3 存在较大区别
    const calcPaneInstances = () => {

      const tabPaneInss = getTabPaneInstanceList()

      const data = tabPaneInss.map((item: any) => {

        const {
          label, value, disabled, labelClass,
        } = item

        return {
          label,
          value,
          disabled,
          labelClass,
          $slots: item ? item.$slots : undefined,
        }
      })

      const moreTabs = data.filter((item) => {
        return item
      })

      state.tabDropInfo.moreTabs = moreTabs
    }

    const addTabs = (_: any, $parent?: any) => {
      state.tabDropInfo.$parent = state.tabDropInfo.$parent || $parent
    }

    onMounted(() => { calcPaneInstances() })
    onUpdated(() => { calcPaneInstances() })

    return {
      ...toRefs(state),
      active,
      addTabs,
      calcPaneInstances,
    }
  },
  render() {
    const panes = getSlotsInRender(this)
    return <div
      ref="selectRef"
      class={classNames(this)}
      style={styles(this)}
    >
      {panes}
    </div>
  },
})
