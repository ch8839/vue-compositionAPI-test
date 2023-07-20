import { computed } from "@ss/mtd-adapter"
import {
  FilteredNode,
  DisplayNode,
  TCheckedStrategy,
} from '@components/cascader/types'
import { FILTERED_NODE_KEY } from '@components/cascader/util'
import {
  TreeFieldName,
  TreeNode,
  DEFAULT_FIELD_NAMES,
} from '@components/tree/types'
import useTreeDataHandler from '@components/tree/useDataHandler'

// 对node的直接操作都能触发root的更新

export interface TreeProps {
  loadData?: Function
  fieldNames?: Object
  multiple?: boolean,
  checkedValues?: any[][]
  checkStrictly: boolean
  checkedStrategy?: TCheckedStrategy
  data?: any[]
  nodeKey: string
  selectable?: boolean
  checkable?: boolean
  autoExpandParent?: boolean
  disabledStrictly: boolean

  expandedKeys: any[]
  loadedKeys: any[]
  checkedKeys: any[]
  selectedKeys: any[]

  expandedValue: any[]
}

function linkedToArray(node: TreeNode) {
  const result = []
  let n: TreeNode | undefined = node
  let i = 0
  while (n) {
    result[i] = n
    i++
    n = n.$parent
  }
  return result.reverse()
}


export const useDataHandler = (props: TreeProps, ctx: any, dataFieldName = 'data') => {
  const treeHandlerHook = useTreeDataHandler(props, ctx, dataFieldName)
  const {
    root,
    setExpand: setTreeExpand,
    updateNode,
    updateParentChecked,
    updateChildChecked,
    updateParentUnChecked,
    updateChildUnChecked,
    getCheckedNodes,
  } = treeHandlerHook
  /* Computed */
  const _fieldNames = computed((): TreeFieldName => {
    return {
      ...DEFAULT_FIELD_NAMES,
      ...props.fieldNames,
    }
  })

  /*   const menuNodes = computed(() => {
    return buildMenuNodes(root.value, [])
  })

  function buildMenuNodes(nodes: TreeNode[], menuNodes: TreeNode[][]): TreeNode[][] {
    const level = menuNodes.length
    menuNodes[level] = nodes || []

    const value = props.expandedValue[level]

    const node = nodes.find((item) => {
      return item.value === value
    })
    if (node && !node.loading && node.children) {
      buildMenuNodes(node.children, menuNodes)
    }
    return menuNodes
  } */

  function creataLoadDataCallback(node: TreeNode, data: any) {
    const fieldNames = _fieldNames.value
    return (children: any[]) => {
      data[fieldNames.loading] = false
      data[fieldNames.children] = children

      setTreeExpand(node, !node.expanded)
    }
  }

  function setExpand(node: TreeNode) {
    const fieldNames = _fieldNames.value
    if (node.hasChildren) {
      if (!node.children && !node.loading) {
        // 动态加载
        const { data } = node
        data[fieldNames.loading] = true
        updateNode(node, {
          loading: true,
        })
        props.loadData &&
          props.loadData(data, creataLoadDataCallback(node, data))
      }
      const { values, nodes } = getValue(node)
      ctx.emit('expanded-change', values, nodes)
    }
  }

  function setChecked(node: TreeNode, checked: boolean) {
    let nextCheckedValues = [...(props.checkedValues || [])]
    const { nodes, values } = getValue(node)
    let checkedPaths = []
    if (props.checkStrictly) {
      if (checked) {
        nextCheckedValues.push(values)
      } else {
        nextCheckedValues = nextCheckedValues.filter((checkedValues) => {
          return checkedValues.some((v, i) => v !== values[i])
        })
      }
      checkedPaths = nextCheckedValues.map((checkedValue) => {
        return getPathByValue(root.value, checkedValue)
      })
    } else {
      const lastNode = nodes[nodes.length - 1]
      lastNode.checked = checked
      if (checked) {
        lastNode.indeterminate = false
        updateParentChecked(lastNode)
        updateChildChecked(lastNode)
      } else {
        updateParentUnChecked(lastNode)
        updateChildUnChecked(lastNode)
      }
      const checkedNodes = getCheckedNodes(root.value)
      checkedPaths = checkedNodes.map((node) => {
        return linkedToArray(node)
      })
      nextCheckedValues = checkedNodes.map((node) => {
        const paths = linkedToArray(node)
        const values = paths.map((node) => node.value)
        return values
      })
    }
    ctx.emit('update:checkedValues', nextCheckedValues, checkedPaths)
    // todo reset nodes
  }

  function getValue(node: DisplayNode): { nodes: TreeNode[]; values: any[] } {
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

  function getPathByValue(nodes: TreeNode[], pathValue: any[]): TreeNode[] {
    const paths: TreeNode[] = []
    pathValue.reduce((items: TreeNode[], v: any) => {
      const node = (items || []).find((item) => item.value === v)
      node && paths.push(node)
      return node && node.children
    }, nodes)
    return paths
  }


  return {
    ...treeHandlerHook,
    root,
    _fieldNames,
    setExpand,
    setChecked,
    getValue,
  }
}

export default useDataHandler
