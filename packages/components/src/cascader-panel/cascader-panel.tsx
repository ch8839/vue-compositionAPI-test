import {
  computed,
  defineComponent,
  PropType,
  classNames, styles,
  vueInstance,
  getScopedSlotsInRender,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import MtdLoading from '@components/loading'
import MtdCascaderMenu from './cascader-menu'
import { FILTERED_NODE_KEY } from '@components/cascader/util'
import { escapeRegexpString } from '@utils/util'
import scrollIntoView from '@utils/scroll-into-view'
import {
  Node,
  FilteredNode,
  DisplayNode,
  TCheckedStrategy,
} from '@components/cascader/types'

import useConfig from '@components/hooks/config'
import { useCascaderPanelProvider } from '@components/cascader/hook'
import useDataHandler from './useDataHandler'
import { TreeNode } from '@components/tree/types'

function defaultFilter(
  filter: string,
  items: any,
  m_fieldNames: { label: string },
) {
  return items.some((option: any) =>
    new RegExp(escapeRegexpString(filter), 'i').test(
      option[m_fieldNames.label] as string,
    ),
  )
}
export default defineComponent({
  name: 'MtdCascaderMenus',
  components: {
    MtdCascaderMenu,
    MtdLoading,
  },
  inheritAttrs: false,
  props: {
    options: Array,
    // 单选时当前选中项
    value: {
      type: Array, // 展开值
      default: () => {
        return []
      },
    },
    expandedValue: {
      type: Array, // 展开值
      default: () => {
        return []
      },
    },
    noDataText: {
      type: String,
      default: '暂无数据',
    },
    expandTrigger: {
      type: String,
      default: 'click',
      validator: (v: string) => {
        return ['click', 'hover'].indexOf(v) > -1
      },
    },
    fieldNames: {
      type: Object,
      default: () => {
        return {}
      },
    },
    loadData: Function,
    loading: Boolean,
    loadingText: String,
    filterable: Boolean,
    filterParent: Boolean, // 是否要过滤掉 父节点
    filter: String,
    filterMethod: {
      type: Function,
      default: defaultFilter,
    },
    noMatchText: {
      type: String,
      default: '暂无搜索结果',
    },
    menuWidth: String,
    multiple: Boolean,
    checkedValues: {
      // 二维数组，内部每一个数组表示一个链路
      type: Array as PropType<any[][]>, // 展开值
      default: () => {
        return []
      },
    },
    checkStrictly: Boolean,
    checkedStrategy: String as PropType<TCheckedStrategy>,
    changeOnSelect: Boolean,
    expandedKeys: {
      type: Array as PropType<any[]>,
      default: () => {
        return []
      },
    },
    loadedKeys: {
      type: Array as PropType<any[]>,
      default: () => {
        return []
      },
    },
    checkedKeys: {
      type: Array as PropType<any[]>,
      default: () => {
        return []
      },
    },
    selectedKeys: {
      type: Array as PropType<any[]>,
      default: () => {
        return []
      },
    },
    disabledStrictly: Boolean,
    nodeKey: {
      type: String,
      default: 'value',
    },
  },
  emits: ['expanded-change', 'select', 'click', 'update:checkedValues'],
  setup(props, ctx) {
    const config = useConfig()
    const prefix = config.getPrefixCls('cascader-menus')
    const cascaderMenuPrefix = config.getPrefixCls('cascader-menu')
    const ins = vueInstance()

    const showCheckbox = computed(() => !!props.multiple)

    useCascaderPanelProvider(props, ins)
    const dataHandlerHook = useDataHandler(props, ctx, 'options')

    delete (dataHandlerHook as any).filter

    return {
      prefix, cascaderMenuPrefix, showCheckbox, ...dataHandlerHook,
    }
  },
  computed: {

    menuNodes(): Node[][] {
      return this.buildMenuNodes(this.root, [])
    },

    flattenNodes(): TreeNode[][] {
      // 扁平化对象，仅当 filterable 时生效，格式为 [[...parentNode, childrenNode]]
      if (this.filterable) {
        return this.getFlattenNodesInCascader(this.root)
      }
      return []
    },

    filteredNodes(): FilteredNode[] {
      // 搜索结果
      const { m_fieldNames } = this
      return this.flattenNodes
        .filter((nodes: TreeNode[]) => {
          const paths = nodes.map((node) => node.data)
          return (this.filterMethod as Function)(this.filter, paths, m_fieldNames)
        })
        .map((nodes) => {
          const labels = nodes.map((n) => n.label).join(' / ')
          const values = nodes.map((n) => n.value)
          const disabled = nodes.some((n) => n.disabled)

          return {
            label: labels,
            value: values,
            isLeaf: true,
            disabled: disabled,
            checked: nodes[nodes.length - 1].checked,
            [FILTERED_NODE_KEY]: true,
            nodes: nodes,
          }
        })
    },

    showNodes(): DisplayNode[][] {
      if (this.filterable && !!this.filter) {
        return [this.filteredNodes]
      } else {
        return this.menuNodes
      }
    },

  },
  methods: {

    getFlattenNodesInCascader(nodes: TreeNode[], paths: TreeNode[] = []): TreeNode[][] {
      let flatNodes: TreeNode[][] = []
      nodes.forEach((node) => {
        const children = node.children
        const hasChildren = children && children.length
        const stack = paths.concat([node])
        if (!hasChildren) {
          flatNodes.push(stack)
        } else {
          if (!this.filterParent) {
            flatNodes.push(stack)
          }
          flatNodes = flatNodes.concat(
            this.getFlattenNodesInCascader(children, stack),
          )
        }
      })
      return flatNodes
    },

    buildMenuNodes(nodes: Node[], menuNodes: Node[][]): Node[][] {
      const level = menuNodes.length
      menuNodes[level] = nodes || []

      const value = this.expandedValue[level]

      const node = nodes.find((item) => {
        return item.value === value
      })
      if (node && !node.loading && node.children) {
        this.buildMenuNodes(node.children, menuNodes)
      }
      return menuNodes
    },

    handleExpand(node: TreeNode) {
      this.setExpand(node)
    },

    handleSelect(node: DisplayNode) {
      const { values, nodes } = this.getValue(node)
      this.$emit('select', values, nodes)
    },

    handleClick(node: DisplayNode) {
      const { values, nodes } = this.getValue(node)
      this.$emit('click', values, nodes)
    },

    handleChecked(node: TreeNode, { checked }: { checked: boolean }) {
      this.setChecked(node, checked)
    },


    scrollIntoView() {
      // scroll all
      (this.$el as HTMLElement)
        .querySelectorAll(`.${this.cascaderMenuPrefix}`)
        .forEach((menu) => {
          scrollIntoView(
            menu as HTMLElement,
            menu.querySelector(`.${this.cascaderMenuPrefix}-item-active`) as
            | HTMLElement
            | undefined,
          )
        })
    },

  },
  render() {
    const {
      value, prefix, cascaderMenuPrefix, filter, loading,
      showNodes, noDataText, noMatchText, menuWidth, loadingText,
    } = this
    const $render = getScopedSlotsInRender(this)!

    // 必然存在 default scopedSlot
    const slots = {
      default: (props: { node: Node, data: any }) => $render({ node: props.node, data: props.node.data }),
    }

    return <div
      class={classNames(this, {
        [`${prefix}-wrapper`]: true,
        [`${prefix}-filtered`]: !!filter,
        [`${prefix}-has-addendum`]: !!getSlotsInRender(this, 'addendum-header') || !!getSlotsInRender(this, 'addendum-footer'),
      })}
      style={styles(this)}
    >
      {getSlotsInRender(this, 'addendum-header') &&
        <div class={`${prefix}-addendum-header`}>
          {getSlotsInRender(this, 'addendum-header')}
        </div>
      }
      <div class={prefix}>
        {loading ? <div
          class={`${cascaderMenuPrefix}-loading`}
          style={{ width: menuWidth }}
        >
          {getSlotsInRender(this, 'loading') || <mtd-loading message={loadingText} />}
        </div >
          : (showNodes.map((nodes: any[], index: number) => <mtd-cascader-menu
            /* style={{ width: menuWidth }} */
            key={index}
            nodes={nodes}
            value={value[index]}
            no-data-text={noDataText}
            no-match-text={noMatchText}
            filtered={!!filter}
            menu-width={menuWidth}
            onExpand={this.handleExpand}
            onSelect={this.handleSelect}
            onClick={this.handleClick}
            onChecked={this.handleChecked}
            v-slots={slots}
            scopedSlots={slots}
          >
          </mtd-cascader-menu>))}
      </div>
      {getSlotsInRender(this, 'addendum-footer') &&
        <div class={`${prefix}-addendum-footer`}>
          {getSlotsInRender(this, 'addendum-footer')}
        </div>
      }
    </div >
  },
})
