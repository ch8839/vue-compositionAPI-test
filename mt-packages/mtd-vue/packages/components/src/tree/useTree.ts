import { inject, computed } from "@ss/mtd-adapter"
import { ITree, TreeNode } from '@components/tree/types'

export interface TreeNodeProps {
  node: TreeNode,
}

type emitTreeEventName =
  'expandedChange' |
  'checkedChange' |
  'loadedData' |
  'selectedNode' |
  'nodeClick' |
  'treeNodeDragStart' |
  'treeNodeDragOver' |
  'treeNodeDragEnd'

export const useTree = (props: TreeNodeProps) => {

  const tree = inject("tree") as ITree

  /* Computed */
  const expandOnClickNode = computed(() => tree.expandOnClickNode)
  const checkOnClickNode = computed(() => tree.checkOnClickNode)
  const indent = computed(() => tree.baseIndent + props.node.level * tree.indent)
  const loadData = computed(() => tree.loadData)
  const treeSlots = computed(() => tree.$scopedSlots)

  const expandIcon = computed(() => tree.expandIcon)
  const selectable = computed(() => tree.selectable)
  const nodeClass = computed(() => tree.nodeClass)
  const draggable = computed(() => tree.draggable)

  /* Methods */
  function emitTree(emitTreeEventName: emitTreeEventName, ...args: any[]) {
    switch (emitTreeEventName) {
      case 'treeNodeDragStart':
        tree.handleDragStart(...args)
        break
      case 'treeNodeDragOver':
        tree.handleDragOver(...args)
        break
      case 'treeNodeDragEnd':
        tree.handleDragEnd(...args)
        break
      default:
        tree.emitter.emit(emitTreeEventName, ...args)
        break
    }
  }


  return {
    expandOnClickNode,
    checkOnClickNode,
    indent,
    loadData,
    expandIcon,
    selectable,
    nodeClass,
    draggable,
    emitTree,
    treeSlots,
  }
}

export default useTree
