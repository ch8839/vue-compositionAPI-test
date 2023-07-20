import { inject, computed, watch, getCurrentInstance, ref } from '@ss/mtd-adapter'
import {
  Node,
  CascaderFieldName,
  FilteredNode,
  DisplayNode,
  TCheckedStrategy,
} from '@components/cascader/types'
import { DEFAULT_FIELD_NAMES, FILTERED_NODE_KEY } from '@components/cascader/util'

// 对node的直接操作都能触发root的更新

export interface TreeProps {
  loadData?: Function
  fieldNames?: Object
  multiple: boolean,
  checkedValues: any[][]
  checkStrictly: boolean
  checkedStrategy?: TCheckedStrategy
  data?: any[]
}

export const useTree = (props: TreeProps, ctx: any, inss: any) => {

  const m_fieldNames = computed(() => {
    return {
      ...DEFAULT_FIELD_NAMES,
      ...props.fieldNames,
    }
  })
  const dataNodeMap = new Map()
  const root = ref<any[]>(buildNodes(createNodes(props.data || [])))

  function recomputeRoot() {
    dataNodeMap.clear()
    root.value = buildNodes(createNodes(props.data || []))
  }

  watch(() => props.data, () => {
    recomputeRoot()
  }, { deep: true })

  function createNodes(options: any[], parent?: Node, level = 0): Node[] {
    const fieldNames = m_fieldNames.value
    const { loadData } = props
    return options.map((item, i) => {
      const node: Node = {
        $parent: parent,
        $index: i,
        key: i.toString(),
        level: level,
        data: item,

        value: item[fieldNames.value],
        label: item[fieldNames.label],
        isLeaf: item[fieldNames.isLeaf],
        disabled: item[fieldNames.disabled],
        loading: item[fieldNames.loading],

        selected: false,
        checked: false,
        hasChildrenChecked: false,
        indeterminate: false,
        hasChildren: false,
      }
      let children = item[fieldNames.children]
      children = children && children.length ? children : undefined
      Object.assign(node, {
        children: children
          ? createNodes(children, node, level + 1)
          : undefined,
        hasChildren: !!children || (loadData && !node.isLeaf),
      })
      dataNodeMap.set(item, node)
      return node
    })
  }


  // 更新单个节点中的data,同时会更新视图层
  function updateNode(node: Node, newData: any) {
    const fieldNames = m_fieldNames.value
    const { loadData } = props

    node.value = newData[fieldNames.value]
    node.label = newData[fieldNames.label]
    node.isLeaf = newData[fieldNames.isLeaf]
    node.disabled = newData[fieldNames.disabled]
    node.loading = newData[fieldNames.loading]

    let children = newData[fieldNames.children]
    children = children && children.length ? children : undefined
    Object.assign(node, {
      children: children
        ? createNodes(children, node, node.level + 1)
        : undefined,
      hasChildren: !!children || (loadData && !node.isLeaf),
    })
  }

  function buildNodes(nodes: Node[]): Node[] {
    if (!props.multiple) {
      return nodes
    }
    const checkedNodes: Node[] = []
    props.checkedValues.forEach((pathValue: any) => {
      pathValue.reduce((items: Node[], v: any, i: number) => {
        const node = items.find((item) => item.value === v)
        if (!node) return []
        node.hasChildrenChecked = true
        if (i === pathValue.length - 1) {
          node.checked = true
          // 计算时忽略 disabled 节点
          !node.disabled && checkedNodes.push(node)
        }
        return node.children || []
      }, nodes)
    })
    if (!props.checkStrictly) {
      checkedNodes.forEach(updateChildChecked)
      checkedNodes.forEach(updateParentChecked)
    }
    return nodes
  }

  function updateParentChecked(node: Node) {
    const { $parent: parent } = node
    if (parent && !parent.disabled) {
      const children = parent.children as Node[]
      const allChecked = children.every((child) => {
        return child.checked || child.disabled
      })

      parent.checked = allChecked
      parent.indeterminate = !allChecked
      updateParentChecked(parent)
    }
  }

  function updateChildChecked(node: Node) {
    const { children } = node
    if (children) {
      children.forEach((item) => {
        if (!item.checked && !item.disabled) {
          item.checked = true
          updateChildChecked(item)
        }
      })
    }
  }

  function setChecked(node: Node, { checked }: { checked: boolean }) {
    let nextCheckedValues = [...props.checkedValues]
    const { nodes, values } = getValue(node)
    let checkedPaths: Node[][] = []
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
      const checkedNodes = getCheckedNode(root.value)
      checkedPaths = checkedNodes.map((node) => {
        return linkedToArray(node)
      })
      nextCheckedValues = checkedNodes.map((node) => {
        const paths = linkedToArray(node)
        const values = paths.map((node) => node.value)
        return values
      })
    }

    function updateParentUnChecked(node: Node) {
      const { $parent: parent } = node
      if (parent) {
        const children = parent.children as Node[]
        const anyChecked = children.some((child) => {
          // 忽略 disabled 的选项
          return !child.disabled && (child.checked || child.indeterminate)
        })

        parent.checked = false
        parent.indeterminate = anyChecked
        updateParentUnChecked(parent)
      }
    }

    function updateChildUnChecked(node: Node) {
      const { children } = node
      if (children) {
        children.forEach((item) => {
          if (!item.disabled) {
            item.checked = false
            updateChildUnChecked(item)
          }
        })
      }
    }

    ctx.emit('update:checkedValues', nextCheckedValues, checkedPaths)
    // todo reset nodes
  }

  function getPathByValue(nodes: Node[], pathValue: any[]): Node[] {
    const paths: Node[] = []
    pathValue.reduce((items: Node[], v: any, i: number) => {
      const node = (items || []).find((item) => item.value === v)
      node && paths.push(node)
      return node && node.children
    }, nodes)
    return paths
  }

  function getValue(node: DisplayNode): { nodes: Node[]; values: any[] } {
    let nextValue
    let nodes
    if ((node as FilteredNode)[FILTERED_NODE_KEY]) {
      const { value, nodes: ns } = node as FilteredNode
      nextValue = value
      nodes = ns
    } else {
      nodes = linkedToArray(node as Node)
      nextValue = nodes.map((node: Node) => node.value)
    }
    return {
      nodes,
      values: nextValue,
    }
  }

  function linkedToArray(node: Node) {
    const result: Node[] = []
    let n: Node | undefined = node
    let i = 0
    while (n) {
      result[i] = n
      i++
      n = n.$parent
    }
    return result.reverse()
  }

  function creataLoadDataCallback(data: any) {
    const fieldNames = m_fieldNames.value
    return (children: any[]) => {
      data[fieldNames.loading] = false
      data[fieldNames.children] = children

      //测试
      const curNode = dataNodeMap.get(data)
      updateNode(curNode, data)
    }
  }

  function setExpand(node: Node) {
    const fieldNames = m_fieldNames.value
    if (node.hasChildren) {
      if (!node.children && !node.loading) {
        // 动态加载
        const { data } = node
        data[fieldNames.loading] = true
        node.loading = true // 一般不建议直接改node，期望上node只读，但此处对node的状态可控
        //updateRoot()
        props.loadData &&
          props.loadData(data, creataLoadDataCallback(data))
      }
      const { values, nodes } = getValue(node)
      ctx.emit('expanded-change', values, nodes)
    }
  }

  function getCheckedNode(nodes: Node[], ...args: any[]): Node[] {
    const checkedStrategy = args[0]
      ? args[0]
      : props.checkedStrategy
    const checkedNodes: Node[] = []
    function flatChecked(node: Node) {
      const { children, checked } = node
      if (checked) {
        checkedNodes.push(node)
      }
      children && children.forEach(flatChecked)
    }
    nodes.forEach(flatChecked)
    if (checkedStrategy === 'children') {
      return checkedNodes.filter((node) => {
        return !node.children
      })
    } else if (checkedStrategy === 'parent') {
      return checkedNodes.filter((node) => {
        const { $parent } = node
        return !$parent || node.disabled || !$parent.checked
      })
    }
    return checkedNodes
  }

  function getNodes(values: any[]) {
    const nodes: Node[] = []
    values.reduce((items: Node[], v: any, i: number) => {
      const node = items.find((item) => item.value === v)
      if (!node) return []
      nodes.push(node)
      return node.children || []
    }, root.value)
    return nodes
  }

  return {
    root,
    getValue,
    setExpand,
    setChecked,
    getNodes,
    getCheckedNode,
  }
}