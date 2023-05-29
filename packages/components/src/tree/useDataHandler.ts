import { computed, watch, ref, hasProp } from '@ss/mtd-adapter'
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
  TreeData,
} from './types'
import useKeysControl from './useKeysControl'

export function linkedToArray(node: TreeNode): TreeNode[] {
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

export function getValue(node: DisplayNode): { nodes: TreeNode[]; values: any[] } {
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

export function getPathByValue(nodes: TreeNode[], pathValue: any[]): TreeNode[] {
  const paths: TreeNode[] = []
  pathValue.reduce((items: TreeNode[], v: any) => {
    const node = (items || []).find((item) => item.value === v)
    node && paths.push(node)
    return node && node.children
  }, nodes)
  return paths
}

export function getNodesByValues(value: any[], root: TreeNode[]) {
  const nodes: TreeNode[] = []
  value.reduce((items: TreeNode[], v: any) => {
    const node = items.find((item) => item.value === v)
    if (!node) return []
    nodes.push(node)
    return node.children || []
  }, root)
  return nodes
}


// 对node的直接操作都能触发root的更新

export interface TreeProps {
  loadData?: Function
  fieldNames?: Object
  multiple?: boolean,
  checkedValues?: any[][]
  checkStrictly: boolean
  checkedStrategy?: TCheckedStrategy
  disabledStrictly: boolean
  data?: any[]
  nodeKey: string
  selectable?: boolean
  checkable?: boolean
  autoExpandParent?: boolean
  defaultExpandAll?: boolean

  expandedKeys: any[]
  loadedKeys: any[]
  checkedKeys: any[]
  selectedKeys: any[]

  filterNodeMethod?: (query: string, nodeData: any, node: TreeNode) => boolean
}

function removeKey(key: string, keys: string[]) {
  const index = keys.indexOf(key)
  if (index > -1) {
    keys.splice(index, 1)
  }
  return index > -1
}

export const useDataHandler = (props: TreeProps, ctx: any, dataFieldName = 'data') => {
  const keysControl = useKeysControl(props, ctx)
  const {
    m_expandedKeys,
    setExpandedKeys,
    m_checkedKeys,
    setCheckedKeys,
    setSelectedKeys,
    m_loadedKeys,
    setLoadedKeys,
    selectedKeyMap,
    loadedKeyMap,
  } = keysControl

  const allHidden = ref(false)
  const forceUpdateRootFlag = ref(false)

  /* Computed */
  const m_fieldNames = computed((): TreeFieldName => {
    return {
      ...DEFAULT_FIELD_NAMES,
      ...props.fieldNames,
    }
  })

  let oldNodeMap = new Map<any, TreeNode>() // key --> node
  let nodeMap = new Map<any, TreeNode>() // key --> node

  //const root = ref<any[]>(buildNodes(createNodes(props.data || [])))
  const root = computed(() => {
    if (forceUpdateRootFlag.value) {
      forceUpdateRootFlag.value = false
    }
    oldNodeMap = nodeMap
    nodeMap = new Map<any, TreeNode>()
    const oriRoot = createNodes((props as any)[dataFieldName] || [])
    changeNodes(oriRoot)
    return buildNodes(oriRoot)
  })

  function createNodes(data: any[], parent?: TreeNode, level = 0): TreeNode[] {
    const fieldNames = m_fieldNames.value
    const { loadData } = props
    return data.map((item, i) => {
      const key = item[props.nodeKey]
      const oldNode = oldNodeMap.get(key)

      const node: TreeNode = {
        key: key,
        $parent: parent,
        $index: i,
        level: level,
        data: item,

        value: item[fieldNames.value],
        label: item[fieldNames.label],
        isLeaf: item[fieldNames.isLeaf],
        disabled: fieldNames.disabled in item
          ? item[fieldNames.disabled]
          : !props.disabledStrictly
            ? false
            : parent && parent.disabled,
        loading: item[fieldNames.loading],

        // selected: false,

        hasChildrenChecked: false,
        hasChildren: false,

        selectable: !!props.selectable,
        selected: false,

        checked: false,
        checkable: item[fieldNames.checkable] || props.checkable,
        indeterminate: false,

        disableCheckbox: false,
        expanded: false,

        visible: oldNode ? oldNode.visible : true,
      }
      let children = item[fieldNames.children]
      children = children && children.length ? children : undefined
      Object.assign(node, {
        children: children
          ? createNodes(children, node, level + 1)
          : undefined,
        hasChildren: Boolean(!!children || (loadData && !node.isLeaf)),

        selected: selectedKeyMap.value[node.key],
        loaded: loadedKeyMap.value[node.key],
        disableCheckbox: item[fieldNames.disableCheckbox] || node.disabled,
      })
      nodeMap.set(node.key, node)
      return node
    })
  }


  // 更新单个节点中的data,同时会更新视图层
  function updateNodeData(node: TreeNode, newData: any) {
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

  function updateNode(node: TreeNode, newProps: any) {
    //如果你更新的是data，那么应该重新计算
    if (newProps.data) {
      updateNodeData(node, newProps)
    }
    Object.assign(node, newProps)
  }

  function changeNodes(nodes: TreeNode[]) {
    if (!props.multiple) {
      return nodes
    }
    const checkedNodes: TreeNode[] = []
    props.checkedValues && props.checkedValues.forEach((pathValue: any) => {
      pathValue.reduce((items: TreeNode[], v: any, i: number) => {
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
  }

  function buildNodes(nodes: TreeNode[]): TreeNode[] {
    const expandedNodes = m_expandedKeys.value
      .map((key) => {
        return nodeMap.get(key)!
      })
      .filter((node) => !!node)
    expandedNodes.forEach((node) => {
      node.expanded = true
      let parent = node.$parent
      while (props.autoExpandParent && parent && !parent.expanded) {
        parent.expanded = true
        parent = parent.$parent
      }
    })

    const checkedNodes = m_checkedKeys.value
      .map((key) => {
        return nodeMap.get(key)!
      })
      .filter((node) => !!node)
    checkedNodes.forEach((node) => {
      node.checked = true
    })
    if (!props.checkStrictly) {
      checkedNodes.forEach(updateChildChecked)
      checkedNodes.forEach(updateParentChecked)
    }

    return nodes
  }

  /* loaded节点的处理 */
  function setLoaded(node: TreeNode, data: TreeData, children: TreeData[]) {
    const { key } = node
    data.children = children
    setLoadedKeys([...m_loadedKeys.value, key])
    node.loaded = true
  }

  /* selected节点处理 */
  const curSelectedNode = ref<TreeNode | null>(null)
  function setSelected(node: TreeNode, selected: boolean) {
    const next = selected ? [node.key] : []
    // this.$emit('update:selectedKeys', next)
    setSelectedKeys(next)
    /* if (curSelectedNode.value && curSelectedNode.value.selected) {
      curSelectedNode.value.selected = false
    }
    curSelectedNode.value = node
    curSelectedNode.value.selected = selected */
    ctx.emit('toggle-selected', node, selected)
  }
  function clearSelectedState() {
    if (curSelectedNode.value) {
      curSelectedNode.value.selected = false
    }
  }

  /* expanded 节点处理 */
  function setExpand(node: TreeNode, expanded: boolean) {
    const { key } = node
    const next = [...m_expandedKeys.value]
    if (expanded) {
      next.push(key)
    } else {
      removeKey(key, next)
    }
    const nodes = getNodesByKeys(next)
    setExpandedKeys(next)

    ctx.emit('toggle-expand', next, {
      node,
      nodes,
      data: node.data,
      expanded,
    })
  }

  /* checked 节点处理 */
  function updateParentChecked(node: TreeNode) {
    const { $parent: parent } = node
    if (parent && !parent.disableCheckbox) {
      const children = parent.children as TreeNode[]
      const allChecked = children.every((child) => {
        return child.checked || child.disabled
      })

      parent.checked = allChecked
      parent.indeterminate = !allChecked
      updateParentChecked(parent)
    }
  }
  function updateChildChecked(node: TreeNode) {
    const { children } = node
    if (children) {
      children.forEach((item) => {
        if (!item.checked && !item.disableCheckbox) {
          item.checked = true
          updateChildChecked(item)
        }
      })
    }
  }
  function updateParentUnChecked(node: TreeNode) {
    const { $parent: parent } = node
    if (parent) {
      const children = parent.children as TreeNode[]
      const anyChecked = children.some((child) => {
        // 忽略 disabled 的选项
        return !child.disableCheckbox && (child.checked || child.indeterminate)
      })

      parent.checked = false
      parent.indeterminate = anyChecked
      updateParentUnChecked(parent)
    }
  }
  function updateChildUnChecked(node: TreeNode) {
    const { children } = node
    if (children) {
      children.forEach((item) => {
        if (!item.disableCheckbox) {
          item.checked = false
          updateChildUnChecked(item)
        }
      })
    }
  }

  function setChecked(node: TreeNode, checked: boolean) {
    const { key } = node
    let keys = [...m_checkedKeys.value]
    let nextCheckedValues = [...(props.checkedValues || [])]
    let checkedPaths: any[] = []
    let checkedNodes
    const { values } = getValue(node)
    if (props.checkStrictly) {
      if (checked) {
        keys.push(key)
        nextCheckedValues.push(values)
      } else {
        const index = keys.indexOf(key)
        if (index > -1) {
          keys.splice(index, 1)
        }
        nextCheckedValues = nextCheckedValues.filter((checkedValues) => {
          return checkedValues.some((v, i) => v !== values[i])
        })
      }
      checkedPaths = nextCheckedValues.map((checkedValue) => {
        return getPathByValue(root.value, checkedValue)
      })
    } else {
      node.checked = checked
      if (checked) {
        node.indeterminate = false
        updateParentChecked(node)
        updateChildChecked(node)
      } else {
        updateParentUnChecked(node)
        updateChildUnChecked(node)
      }
      checkedNodes = getCheckedNodes()
      keys = checkedNodes.map((n) => n.key)
      checkedPaths = checkedNodes.map((node) => {
        return linkedToArray(node)
      })
      nextCheckedValues = checkedNodes.map((node) => {
        const paths = linkedToArray(node)
        const values = paths.map((node) => node.value)
        return values
      })
    }

    if (!checkedNodes) {
      checkedNodes = getNodesByKeys(keys)
    }

    setCheckedKeys(keys)
    ctx.emit('toggle-checked', keys, {
      node,
      nodes: checkedNodes,
      checked,
      checkedPaths,
      values: nextCheckedValues,
    })
  }

  /* 获取特定节点 */
  function getCheckedNodes(checkedStrategy?:boolean): TreeNode[] {
    const nodes = root.value
    const cs = checkedStrategy === undefined
      ? props.checkedStrategy
      : checkedStrategy
    const checkedNodes: TreeNode[] = []
    function flatChecked(node: TreeNode) {
      const { children, checked } = node
      if (checked) {
        checkedNodes.push(node)
      }
      children && children.forEach(flatChecked)
    }
    nodes.forEach(flatChecked)
    if (cs === 'children') {
      return checkedNodes.filter((node) => {
        return !node.children
      })
    } else if (cs === 'parent') {
      return checkedNodes.filter((node) => {
        const { $parent } = node
        return !$parent || node.disabled || !$parent.checked
      })
    }
    return checkedNodes
  }
  function getHalfCheckedNodes() {
    const nodes = root.value
    const halfCheckedNodes: TreeNode[] = []
    function flatHalfChecked(node: TreeNode) {
      const { children, checked, checkable, indeterminate } = node
      if (indeterminate) {
        halfCheckedNodes.push(node)
      }
      if (checkable && (checked || indeterminate)) {
        children && children.forEach(flatHalfChecked)
      }
    }
    nodes.forEach(flatHalfChecked)
    return halfCheckedNodes
  }
  function getNodesByValues(values: any[]) {
    const nodes: TreeNode[] = []
    values.reduce((items: TreeNode[], v: any) => {
      const node = items.find((item) => item.value === v)
      if (!node) return []
      nodes.push(node)
      return node.children || []
    }, root.value)
    return nodes
  }
  function getNodesByKeys(keys: string[]) {
    return keys.map((key) => {
      return nodeMap.get(key)
    })
  }
  function getNodeByKey(key: string) {
    return nodeMap.get(key)
  }

  // 获得扁平的树节点
  // isNeedRender: 是否仅仅要可渲染的平铺节点
  function getFlattenNodes(nodes: TreeNode[], isNeedRender = false): TreeNode[] {
    const flatNodes: TreeNode[] = []

    function DFS(children: TreeNode[]) {
      children.forEach((node) => {

        const isRender = node.expanded
          || (node.$parent && node.$parent.expanded)
          || !node.$parent

        if (isNeedRender && !isRender) return
        if (!node.visible) return

        flatNodes.push(node)
        const children = node.children
        const hasChildren = children && children.length

        if (hasChildren && node.expanded) {
          DFS(node.children!)
        }
      })
    }

    DFS(nodes)

    return flatNodes
  }


  // @ 默认展开功能 start
  const isExpandedControlled = computed(() => hasProp(this, 'expandedKeys'))
  watch(() => props.data, (data) => {
    if (!isExpandedControlled.value && props.defaultExpandAll && data) {
      setExpandedKeys(getDefaultExpandedKeys(data))
    }
  }, { immediate: true })

  function getDefaultExpandedKeys(data: any[]) {
    const defaultExpandedKeys: string[] = []
    if (data.length) {
      handleExpandedKeys(data, defaultExpandedKeys)
    }
    return defaultExpandedKeys
  }
  function handleExpandedKeys(source: any[], target: any[]) {
    const childField = m_fieldNames.value.children || 'children'
    source.forEach((item) => {
      if (item[childField] && item[childField].length) {
        target.push(item[props.nodeKey])
        handleExpandedKeys(item[childField], target)
      }
    })
  }
  // @默认展开功能 end

  //  public methods
  function filter(val: string) {
    const { filterNodeMethod } = props
    if (!filterNodeMethod) {
      throw new Error('[MTD Tree] filterNodeMethod is required when filter')
    }
    const traverse = function (nodes: TreeNode[]) {
      if (nodes) {
        nodes.forEach((node) => {
          let childVisible = false
          if (node.children) {
            childVisible = traverse(node.children)
          }
          node.visible = childVisible || filterNodeMethod(val, node.data, node)
        })
        return nodes.some((node) => node.visible)
      }
      return false
    }
    allHidden.value = !traverse(root.value)
    forceUpdateRootFlag.value = true
  }

  return {
    root,
    m_fieldNames,
    nodeMap,
    removeKey,
    updateNode,
    setExpand,
    setChecked,
    setSelected,
    setLoaded,
    getNodesByValues,
    getCheckedNodes,
    getHalfCheckedNodes,
    getNodesByKeys,
    getNodeByKey,
    ...keysControl,

    clearSelectedState,

    updateParentChecked,
    updateChildChecked,
    updateParentUnChecked,
    updateChildUnChecked,

    getFlattenNodes,

    filter,
    allHidden,
  }
}

export default useDataHandler
