import {
  defineComponent, PropType, markRaw, computed, reactive, toRefs, provide,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import MtdTreeNode from '@components/tree-node'
import MtdVirtual from '@components/virtual'
import {
  contains,
  removeChild,
  insertBefore,
  insertAfter,
  insertChild,
} from './util'
import { addClass, removeClass } from '@utils/dom'
import mitt from '@utils/mitt'
import {
  TreeNode,
  TreeData,
  TreeState,
  TreeDropType,
  TCheckedStrategy,
} from './types'
import TreeNodeInterface from '@components/tree-node/types'
import vueInstance from '@components/hooks/instance'
import useDataHandler from './useDataHandler'
import {
  Fragment,
} from '@ss/mtd-adapter'

export default defineComponent({
  name: 'MtdTree',
  components: {
    MtdTreeNode,
    MtdVirtual,
    Fragment,
  },
  inheritAttrs: true,
  props: {
    nodeClass: {
      type: [String, Function],
      default: '',
    },
    expandIcon: {
      type: String,
      default: 'triangle-down',
    },
    data: {
      type: Array as PropType<TreeData[]>,
      default: () => {
        return []
      },
    },
    checkable: Boolean,
    checkedKeys: {
      type: Array as PropType<string[]>,
      default: () => {
        return []
      },
    },
    checkStrictly: {
      type: Boolean,
      default: false,
    },
    disabledStrictly: {
      type: Boolean,
      default: true,
    },
    checkedStrategy: {
      type: String as PropType<TCheckedStrategy>,
      default: 'all',
      validator: (v: string) => {
        return ['all', 'parent', 'children'].indexOf(v) > -1
      },
    },

    selectable: {
      type: Boolean,
      default: true,
    },
    selectedKeys: {
      type: Array as PropType<string[]>,
      default: () => {
        return []
      },
    },

    defaultExpandAll: {
      type: Boolean,
      default: false,
    },
    expandedKeys: {
      type: Array as PropType<string[]>,
      default: () => {
        return []
      },
    },
    autoExpandParent: {
      type: Boolean,
      default: false,
    },
    loadData: Function,
    loadedKeys: {
      type: Array as PropType<string[]>,
      default: () => {
        return []
      },
    },
    expandOnClickNode: {
      type: Boolean,
      default: true,
    },
    checkOnClickNode: {
      type: Boolean,
      default: false,
    },
    nodeKey: {
      type: String,
      default: 'id',
    },
    baseIndent: {
      type: Number,
      default: 0,
    },
    indent: {
      type: Number,
      default: 20,
    },

    emptyText: {
      type: String,
      default: '暂无数据',
    },
    fieldNames: {
      type: Object,
      default: () => {
        return {}
      },
    },

    draggable: Boolean,
    allowDrag: Function,
    allowDrop: Function,
    filterNodeMethod: {
      type: Function as PropType<(query: string, nodeData: any, node: TreeNode) => boolean>,
    },
    virtual: Boolean,
    height: [String, Number],
  },
  emits: [
    'update:loadedKeys',
    'update:expandedKeys',
    'toggle-expand',
    'update:checkedKeys',
    'toggle-checked',
    'update:selectedKeys',
    'toggle-selected',
    'node-click',
    'node-drag-start',
    'node-drag-enter',
    'node-drag-over',
    'node-drag-leave',
    'node-drag-end',
    'node-drop',
  ],
  setup(props, ctx) {

    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('tree'))
    const ins = vueInstance()

    provide('tree', ins)

    const state = reactive<TreeState>({
      forceNumber: 1,
      dragState: {
        showDropIndicator: false,
        draggingNode: undefined,
        dropNode: undefined,
        allowDrop: true,
      },
      emitter: markRaw(mitt()),
      // autoExpandParent: false,
    })

    const dataHandlerHook = useDataHandler(props, ctx)

    const flatNodes = computed(() => {
      return dataHandlerHook.getFlattenNodes(dataHandlerHook.root.value, true)
    })

    return {
      prefix, ...toRefs(state), ...dataHandlerHook, flatNodes,
    }
  },

  created() {
    this.emitter.on('expandedChange', this.handleExpanded)
    this.emitter.on('checkedChange', this.handleChecked)
    this.emitter.on('loadedData', this.handleDataLoaded)
    this.emitter.on('selectedNode', this.handleSelectedNoded)
    this.emitter.on('nodeClick', this.handleNodeClick)
  },

  methods: {

    handleDataLoaded(node: TreeNode, data: TreeData, children: TreeData[]) {
      this.setLoaded(node, data, children)
    },
    handleExpanded(node: TreeNode, expanded: boolean) {
      this.setExpand(node, expanded)
    },
    handleChecked(node: TreeNode, checked: boolean) {
      this.setChecked(node, checked)
    },

    handleSelectedNoded(node: TreeNode, selected: boolean) {
      this.setSelected(node, selected)
    },

    handleNodeClick(...args: any[]) {
      this.$emit('node-click', ...args)
    },

    // Thanks to https://github.com/ElemeFE/element/blob/dev/packages/tree/src/tree.vue
    handleDragStart(event: DragEvent, treeNode: TreeNodeInterface) {
      if (
        typeof this.allowDrag === 'function' &&
        !this.allowDrag(treeNode.node)
      ) {
        event.preventDefault()
        return false
      }
      (event.dataTransfer as DataTransfer).effectAllowed = 'move'
      // wrap in try catch to address IE's error when first param is 'text/plain'
      try {
        // setData is required for draggable to work in FireFox
        // the content has to be '' so dragging a node out of the tree won't open a new tab in FireFox
        (event.dataTransfer as DataTransfer).setData('text/plain', '')
        // eslint-disable-next-line no-empty
      } catch (e) { }
      this.dragState.draggingNode = treeNode
      this.$emit('node-drag-start', treeNode.node)
    },
    handleDragOver(event: DragEvent, treeNode: TreeNodeInterface) {
      const dropNode = treeNode // findNearestComponent(event.target);
      const { dragState } = this

      const oldDropNode = dragState.dropNode
      if (oldDropNode && oldDropNode !== dropNode) {
        removeClass(oldDropNode.$el, `${this.prefix}-tree-drop-inner`)
      }
      const draggingNode = dragState.draggingNode
      if (!draggingNode || !dropNode) {
        return
      }

      // 判断插入位置
      let dropPrev = true
      let dropInner = true
      let dropNext = true
      let userAllowDropInner = true
      if (typeof this.allowDrop === 'function') {
        dropPrev = this.allowDrop(draggingNode.node, dropNode.node, 'prev')
        userAllowDropInner = dropInner = this.allowDrop(
          draggingNode.node,
          dropNode.node,
          'inner',
        )
        dropNext = this.allowDrop(draggingNode.node, dropNode.node, 'next')
      }
      (event.dataTransfer as DataTransfer).dropEffect = dropInner
        ? 'move'
        : 'none'
      if ((dropPrev || dropInner || dropNext) && oldDropNode !== dropNode) {
        if (oldDropNode) {
          this.$emit('node-drag-leave', draggingNode.node, oldDropNode.node)
        }
        this.$emit('node-drag-enter', draggingNode.node, dropNode.node)
      }
      if (dropPrev || dropInner || dropNext) {
        dragState.dropNode = dropNode
      }

      if (dropNode.nextNode === draggingNode.node) {
        // 已经是下一级，不能插入在下一个
        dropNext = false
      }
      if (dropNode.previousNode === draggingNode.node) {
        // 已经是上一级，不能插入在前一个
        dropPrev = false
      }
      if (contains(dropNode.node, draggingNode.node, false)) {
        // 已经是子集，不能插入在内
        dropInner = false
      }
      if (
        draggingNode.node === dropNode.node ||
        contains(draggingNode.node, dropNode.node)
      ) {
        // 原位置 或是 移动至自身的子集
        dropPrev = false
        dropInner = false
        dropNext = false
      }
      const targetPosition = dropNode.$el
        .querySelector(`.${this.prefix}-tree-node-content`)
        .getBoundingClientRect()
      const treePosition = this.$el.getBoundingClientRect()

      let dropType: TreeDropType
      const prevPercent = dropPrev
        ? dropInner
          ? 0.25
          : dropNext
            ? 0.45
            : 1
        : -1
      const nextPercent = dropNext
        ? dropInner
          ? 0.75
          : dropPrev
            ? 0.55
            : 0
        : 1

      const distance = event.clientY - targetPosition.top
      if (distance < targetPosition.height * prevPercent) {
        dropType = 'before'
      } else if (distance > targetPosition.height * nextPercent) {
        dropType = 'after'
      } else if (dropInner) {
        dropType = 'inner'
      } else {
        dropType = 'none'
      }

      let indicatorTop = -9999
      const iconPosition = dropNode.$el
        .querySelector(`.${this.prefix}-tree-node-expand-icon`)
        .getBoundingClientRect()

      const dropIndicator = this.$refs.dropIndicator as HTMLElement
      if (dropType === 'before') {
        indicatorTop = iconPosition.top - treePosition.top - 2 // 样式问题，顶部增加 2px 位移
      } else if (dropType === 'after') {
        indicatorTop = iconPosition.bottom - treePosition.top
      }
      dropIndicator.style.top = indicatorTop + 'px'
      dropIndicator.style.left = iconPosition.right - treePosition.left + 'px'

      if (dropType === 'inner') {
        addClass(dropNode.$el, `${this.prefix}-tree-drop-inner`)
      } else {
        removeClass(dropNode.$el, `${this.prefix}-tree-drop-inner`)
      }
      dragState.showDropIndicator =
        dropType === 'before' || dropType === 'after'
      dragState.allowDrop = dragState.showDropIndicator || userAllowDropInner
      dragState.dropType = dropType
      this.$emit('node-drag-over', draggingNode.node, dropNode.node)
    },
    handleDragEnd(event: DragEvent) {
      const { dragState } = this
      const { draggingNode, dropType, dropNode } = dragState
      event.preventDefault();
      (event.dataTransfer as DataTransfer).dropEffect = 'move'

      // 将 node 改为 data
      if (draggingNode && dropNode) {
        const draggingNodeCopy = draggingNode.node
        const draggingParent = draggingNode.node.$parent
          ? draggingNode.node.$parent
          : {
            data: { [this._fieldNames.children]: this.data },
            children: this.root,
          }
        const drogParent = dropNode.node.$parent
          ? dropNode.node.$parent
          : {
            data: { [this._fieldNames.children]: this.data },
            children: this.root,
          }

        if (dropType !== 'none') {
          removeChild(draggingParent, draggingNode.node, this._fieldNames)
        }
        if (dropType === 'before') {
          insertBefore(
            drogParent,
            draggingNodeCopy,
            dropNode.node,
            this._fieldNames,
          )
        } else if (dropType === 'after') {
          insertAfter(
            drogParent,
            draggingNodeCopy,
            dropNode.node,
            this._fieldNames,
          )
        } else if (dropType === 'inner') {
          insertChild(dropNode.node, draggingNodeCopy, -1, this._fieldNames)
        }

        removeClass(dropNode.$el, `${this.prefix}-tree-drop-inner`)

        this.$emit('node-drag-end', draggingNode.node, dropNode.node, dropType)
        if (dropType !== 'none') {
          this.$emit('node-drop', draggingNode.node, dropNode.node, dropType)
        }
      }
      if (draggingNode && !dropNode) {
        this.$emit('node-drag-end', draggingNode.node, null, dropType)
      }
      dragState.showDropIndicator = false
      dragState.draggingNode = undefined
      dragState.dropNode = undefined
      dragState.allowDrop = true
    },
  },
  render() {
    const { prefix, virtual, flatNodes, expandOnClickNode, draggable, root,
      data, emptyText, dragState, allHidden, loading } = this

    const renderNode = ({ row: node }: { row: TreeNode, index: number }) => {

      return <mtd-tree-node
        key={node.key}
        node={node}
        data={node.data}
        noChildren
      />
    }

    const renderNodes = () => {
      return virtual
        ? <mtd-virtual
          visible={true}
          view-tag="div"
          data={flatNodes}
          row-height={36}
          renderItem={renderNode}
          virtual={true}
          height={this.height}
        />
        : <fragment>
          {root.map((child: TreeNode) => <mtd-tree-node
            key={child.key}
            node={child}
            data={child.data}
          />)}
        </fragment>

    }

    return <div
      class={{
        [prefix]: true,
        [`${prefix}-expand-on-node`]: expandOnClickNode,
        [`${prefix}-draggable`]: draggable,
      }}
    >
      {renderNodes()}
      {(!data || !data.length || allHidden) && !loading &&
        (this.$slots.empty || <div class={`${prefix}-empty`}>{emptyText}</div>)
      }
      <div
        v-show={dragState.showDropIndicator}
        class={`${prefix}-drop-indicator`}
        ref="dropIndicator"
      />
    </div>
  },
}) as any // 🤡
