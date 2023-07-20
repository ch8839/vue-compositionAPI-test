import {
  computed,
  defineComponent,
  PropType,
  ref,
  toRefs,
  reactive, classNames, styles,
  defineEmits,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'

import MtdCheckbox from '@components/checkbox'
import MtdLoading from '@components/loading'
import MtdCollapseTransition from '@components/transitions/collapse-transition'
import { isFunction } from '@utils/type'
import { TreeNode, TreeData } from '@components/tree/types'
import { NodeClassFunction } from './types'
import useTree from '@components/tree/useTree'
import MtdIcon from '@components/icon'

export default defineComponent({
  name: 'MtdTreeNode',
  components: {
    MtdCheckbox,
    MtdCollapseTransition,
    MtdLoading,
    MtdIcon,
  },
  inheritAttrs: false,
  props: {
    /* nodeClass: {
      type: [String, Function] as PropType<string | NodeClassFunction>,
      default: '',
    }, */
    // expandIcon: String,
    node: {
      type: Object as PropType<TreeNode>,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    // selectable: Boolean,
    destroyOnCollapse: Boolean,
    noChildren: Boolean,
    // expandOnClickNode: Boolean,
    // checkOnClickNode: Boolean,
    // indent: Number,
    // loadData: Function as PropType<loadData>,

    // draggable: Boolean,
  },
  emits: defineEmits([
    //'selected',
    //'node-click',
    //'expandedChange',
    //'checkedChange',
    //'loadedData',
    //'tree-node-drag-start',
    //'tree-node-drag-end',
    //'tree-node-drag-over',
  ]),
  setup(props) {
    const config = useConfig()

    const loading = ref(false)
    const prefix = computed(() => config.getPrefixCls('tree-node'))
    const prefixMTD = computed(() => config.getPrefix())

    const treeHook = useTree(props)
    return {
      prefix, loading, ...toRefs(reactive(treeHook)), prefixMTD,
    }
  },
  computed: {
    className(): string {
      const { nodeClass } = this
      return isFunction(nodeClass)
        ? (nodeClass as NodeClassFunction)(this.node, this.data)
        : (nodeClass as string)
    },
    disabled(): boolean {
      return this.node.disabled
    },
    expandable(): boolean {
      return !!this.node.children || (!!this.loadData && !this.node.isLeaf)
    },
    disableCheckbox(): boolean {
      return !!this.node.disableCheckbox
    },
    checkable(): boolean {
      return !!this.node.checkable
    },
    checked(): boolean {
      return this.node.checked
    },
    nextNode(): TreeNode | undefined {
      const parent = this.node.$parent
      if (parent) {
        const index = (parent.children as TreeNode[]).indexOf(this.node)
        if (index > -1) {
          return (parent.children as TreeNode[])[index + 1]
        }
      }
      return undefined
    },
    previousNode(): TreeNode | undefined {
      const parent = this.node.$parent
      if (parent) {
        const index = (parent.children as TreeNode[]).indexOf(this.node)
        if (index > -1) {
          return index > 0
            ? (parent.children as TreeNode[])[index - 1]
            : undefined
        }
      }
      return undefined
    },
  },
  methods: {
    handleClick(e: Event) {
      e.stopPropagation()
      if (this.expandOnClickNode) {
        this.handleExpandIconClick(e)
      }
      if (this.checkOnClickNode) {
        this.handleCheckboxInput(!this.checked)
      }
      if (this.selectable && !this.disabled && !this.node.selected) {
        this.emitTree('selectedNode', this.node, true)
      }
      this.emitTree('nodeClick', this.node, this.data)
    },
    handleExpandIconClick(e: Event) {
      e.stopPropagation()
      if (this.expandable && !this.loading) {
        const expanded = !this.node.expanded
        if (
          expanded &&
          this.loadData &&
          !this.node.loaded &&
          !this.node.isLeaf
        ) {
          this.loading = true
          this.loadData(this.node, this.handleLoadData)
        }
        this.emitTree('expandedChange', this.node, expanded)
        // todo 看下 loadData 时需不需要发送 expanded 事件
      }
    },
    handleCheckboxInput(v: boolean) {
      if (!this.disabled && !this.disableCheckbox) {
        this.emitTree('checkedChange', this.node, v)
      }
    },
    handleCheckboxClick(e: Event) {
      e.stopPropagation()
    },
    handleLoadData(children: TreeData[]) {
      this.loading = false
      this.emitTree('loadedData', this.node, this.data, children)
    },

    handleDragStart(event: DragEvent) {
      event.stopPropagation()
      if (!this.draggable) return
      this.emitTree('treeNodeDragStart', event, this)
    },

    handleDragOver(event: DragEvent) {
      event.stopPropagation()
      if (!this.draggable) return
      this.emitTree('treeNodeDragOver', event, this)
      event.preventDefault()
    },

    handleDrop(event: DragEvent) {
      event.stopPropagation()
      event.preventDefault()
    },

    handleDragEnd(event: DragEvent) {
      event.stopPropagation()
      if (!this.draggable) return
      this.emitTree('treeNodeDragEnd', event, this)
    },
  },
  render() {
    const { prefix, prefixMTD, className, node, disabled, draggable, expandable, loading, expandIcon, checkable,
      disableCheckbox, indent, treeSlots, noChildren } = this

    const $render = treeSlots.default
    const $renderExtend = treeSlots.extend

    return <div
      class={classNames(this, {
        [prefix]: true,
        [className]: className,
        [`${prefix}-leaf`]: node.isLeaf,
        [`${prefix}-expanded`]: node.expanded,
        [`${prefix}-disabled`]: disabled,
        [`${prefix}-selected`]: node.selected,
      })}
      style={styles(this)}
      draggable={draggable}
      onDragstart={this.handleDragStart}
      ondragover={this.handleDragOver}
      ondragend={this.handleDragEnd}
      ondrop={this.handleDrop}
      v-show={node.visible}

    >
      <div
        class={`${prefix}-content`}
        style={{ 'padding-left': `${indent + 12}px` }}
        onClick={this.handleClick}
      >
        <mtd-icon
          name={loading ? 'loading' : expandIcon}
          class={{
            [`${prefixMTD}-visible-hidden`]: !expandable,
            [`${prefix}-expand-icon`]: !loading,
            [`${prefix}-loading-icon`]: loading,
          }}
          onClick={this.handleExpandIconClick}
        />
        {checkable && <mtd-checkbox
          onClick={this.handleCheckboxClick}
          size="large"
          value={node.checked}
          indeterminate={node.indeterminate}
          disabled={disableCheckbox}
          onChange={this.handleCheckboxInput}
        />}
        {node.icon && <i class={[`${prefix}-icon`, node.icon]} />}
        <span class={`${prefix}-content-wrapper`}>
          {$render && $render({
            node: node,
            data: node.data,
          }) || node.label}
        </span>
      </div>
      {!!$renderExtend && <div
        class={`${prefix}-extend-wrapper`}
        style={{ 'padding-left': `${indent + 8}px` }}
      >
        <div class={`${prefix}-extend`}>
          {$renderExtend({
            node: node,
            data: node.data,
          })}
        </div>
      </div>}
      <mtd-collapse-transition>
        {(expandable && node.expanded && node.children && !noChildren) && <div
          class={`${prefix}-children`}
        >
          {node.children.map((child: TreeNode) => <mtd-tree-node
            expand-icon={expandIcon}
            key={child.key}
            node={child}
            data={child.data}
          />)}
        </div>}
      </mtd-collapse-transition>
    </div >
  },
})
