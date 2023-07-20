
import {
  defineComponent,
  provide,
  reactive,
  computed,
  watch,
  ref,
  markRaw,
  toRefs,
} from '@ss/mtd-adapter'
import mitt from '@utils/mitt'
import vueInstance from '@components/hooks/instance'
import useConfig from '@components/hooks/config'
import { menuItemComp, submenuComp } from './types'

const getParentKeys = (it: submenuComp) => {
  const keys: any[] = []
  const flat = (item: any) => {
    const { submenu } = item
    keys.push(item.name)
    if (submenu) {
      flat(submenu)
    }
  }
  flat(it)
  return keys
}
export default defineComponent({
  name: 'MtdMenu',
  inheritAttrs: true,
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    mode: {
      type: String,
      default: 'inline',
      validator: (value: string): boolean =>
        ['vertical', 'horizontal', 'inline'].indexOf(value) > -1,
    },
    theme: {
      type: String,
      default: 'light',
    },
    modelValue: [String, Number],
    expandedNames: Array,
    defaultExpandedNames: {
      type: Array,
      default: () => [],
    },
    accordion: Boolean,
    collapse: Boolean,
    router: Boolean,
    indent: {
      type: Number,
      default: 24,
    },
    baseIndent: {
      type: Number,
      default: 24,
    },
    lineFeedTitle: Boolean, //icon 和 title-text 是否换行
  },
  emits: [
    'select',
    'open',
    'close',
    'update:modelValue',
    'update:expandedNames',
    'expand-change',
  ],
  setup(props, { emit }) {
    // self 代表组件自身的一些 通用 配置
    const config = useConfig()
    const self = reactive({
      prefix: config.getPrefixCls('menu'),
      ins: vueInstance(),
      emitter: markRaw(mitt()),
    })

    provide('menu', self.ins)

    // 💣 重点留意一下这个isExpandedControl判断————如何判断是用户传进来的还是自带的
    // 方案1： 允许 expandedNames 是 undefined，通过是不是undefined或者数组判断
    // 方案2： isExpandedControl: Reflect.has(vnode.props || {}, 'expandedNames'),
    const state = reactive({
      innerExpandedNames: props.defaultExpandedNames,
      isExpandedControl: Array.isArray('expandedNames'),
    })
    const level = ref(-1) // root
    const lastExpended = ref<any[]>([])

    const isCollapse = computed(() => props.collapse && props.mode == 'inline')
    const expanded = computed(() =>
      state.isExpandedControl ? props.expandedNames as Array<string> : state.innerExpandedNames,
    )

    watch(isCollapse, (n) => {
      if (n) {
        lastExpended.value = state.innerExpandedNames
        state.innerExpandedNames = []
      } else {
        state.innerExpandedNames = lastExpended.value
      }
    })

    watch(
      () => props.defaultExpandedNames,
      () => {
        state.innerExpandedNames = props.defaultExpandedNames
      },
    )

    const isActive = (menuItem: menuItemComp) => props.modelValue === menuItem.name
    const isExpanded = (submenu: submenuComp) => expanded.value.indexOf(submenu.name) > -1
    const getItemStyled = (item: menuItemComp) => {
      if (
        (props.mode === 'inline' && !isCollapse.value) ||
        ((props.mode === 'vertical' || isCollapse.value) && item.level === 0)
      ) {
        return { paddingLeft: `${item.paddingLeft}px` }
      }
    }

    const handleMenuItemClick = (item: menuItemComp) => {
      emit('update:modelValue', item.name)
      emit('select', item)
    }
    self.emitter.on('menuItemClick', handleMenuItemClick)

    const toggleExpanded = (item: submenuComp) => {
      let nextExpanded = []
      const { name: key } = item
      if (!item.isExpanded) {
        if (props.accordion) {
          const keys = getParentKeys(item) // 🤡 需要submenu
          nextExpanded = keys
        } else {
          nextExpanded = [...expanded.value]
          nextExpanded.push(key)
        }
        emit('open', key)
      } else {
        const index = expanded.value.indexOf(key)
        if (index > -1) {
          nextExpanded = [...expanded.value]
          nextExpanded.splice(index, 1)
        }
        emit('close', key)
      }
      emit('update:expandedNames', nextExpanded)
      emit('expand-change', nextExpanded, {
        name: key,
        expanded: !item.isExpanded,
      })
      state.innerExpandedNames = nextExpanded
    }

    return {
      ...toRefs(self),
      ...toRefs(state),
      isCollapse,
      isActive,
      isExpanded,
      getItemStyled,
      toggleExpanded,
      level,
      expanded,
    }
  },
  render() {
    const { prefix, isCollapse, theme, mode } = this
    return <ul
      role={'menu'}
      class={{
        [prefix]: true,
        [`${prefix}-collapse`]: isCollapse,
        [`${prefix}-${theme}`]: theme,
        [`${prefix}-${mode}`]: mode,
      }}
    >
      {this.$slots.default}
    </ul>
  },
})
