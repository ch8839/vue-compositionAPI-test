import {
  defineComponent, reactive, toRefs, onMounted, onUpdated, classNames, styles,
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
    })

    // 💣 该函数vue2/3 存在较大区别
    const calcPaneInstances = () => {
      if (!slots.default) {
        return null
      }
      const data = [].map.call(slots.default(), (item: any) => {
        if (!item || !item.componentOptions) {
          return null
        }
        const {
          label, value, disabled, labelClass,
        } = item.componentOptions.propsData
        const instance = item.componentInstance

        return {
          label,
          value,
          disabled,
          labelClass,
          $slots: instance ? instance.$slots : undefined,
        }
      })
      const moreTabs = data.filter((item) => {
        return item
      })
      state.tabDropInfo.moreTabs = moreTabs
    }

    const addTabs = (_: any, $parent: any) => {
      state.tabDropInfo.$parent = state.tabDropInfo.$parent || $parent
    }

    onMounted(() => { calcPaneInstances() })
    onUpdated(() => { calcPaneInstances() })

    return {
      ...toRefs(state),
      addTabs,
      calcPaneInstances,
    }
  },
  render() {
    const panes = this.$slots.default
    return <div
      ref="selectRef"
      class={classNames(this)}
      style={styles(this)}
    >
      {panes}
    </div>
  },
})
