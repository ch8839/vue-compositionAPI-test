import {
  FilteredNode,
  DisplayNode,
} from '@components/cascader/types'
import { FILTERED_NODE_KEY } from '@components/cascader/util'
import {
  TreeNode,
} from '@components/tree/types'


export function getValue(node: DisplayNode | TreeNode): { nodes: TreeNode[]; values: any[] } {
  let nextValue
  let nodes
  if ((node as FilteredNode)[FILTERED_NODE_KEY]) {
    const { value, nodes: ns } = node as FilteredNode
    nextValue = value
    nodes = ns
  } else {
    nodes = linkedToArray(node as TreeNode)
    nextValue = nodes.map((node: TreeNode) => node.value)
  }
  return {
    nodes,
    values: nextValue,
  }
}

export function linkedToArray(node: TreeNode) {
  const result: TreeNode[] = []
  let n: TreeNode | undefined = node
  let i = 0
  while (n) {
    result[i] = n
    i++
    n = n.$parent
  }
  return result.reverse()
}
