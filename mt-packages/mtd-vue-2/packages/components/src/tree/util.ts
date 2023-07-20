export function findNearestComponent(element: any) {
  let target = element
  while (target && target.tagName !== 'BODY') {
    if (
      target.m__vue__ &&
      (target.m__vue__.$options.name === 'TreeNode' ||
        target.m__vue__.$options.name === 'MtdTreeNode')
    ) {
      return target.m__vue__
    }
    target = target.parentNode
  }
  return null
}

export function contains(source: any, target: any, deep = true) {
  const walk = function (parent: any) {
    const children = parent.children || []
    let result = false
    for (let i = 0, j = children.length; i < j; i++) {
      const child = children[i]
      if (child === target || (deep && walk(child))) {
        result = true
        break
      }
    }
    return result
  }

  return walk(source)
}

export function removeChild(parent: any, child: any, fieldNames: any) {
  // remove node
  const children = parent.children || []
  parent.children = children
  const index = children.indexOf(child)
  if (index > -1) {
    children.splice(index, 1)
  }
  // remove data
  const dataChildren = parent.data[fieldNames.children] || []
  const dataIndex = dataChildren.indexOf(child.data)
  if (dataIndex > -1) {
    dataChildren.splice(dataIndex, 1)
  }
}

export function insertChild(parent: any, child: any, index: number, fieldNames: any) {
  // insert node;
  const children = parent.children || []
  parent.children = children
  if (index === undefined || index < 0) {
    children.push(child)
  } else {
    children.splice(index, 0, child)
  }

  // // insert data
  const childData = child.data
  if (!parent.data[fieldNames.children]) {
    parent.data[fieldNames.children] = []
  }
  const dataChildren = parent.data[fieldNames.children]

  if (typeof index === 'undefined' || index < 0) {
    dataChildren.push(childData)
  } else {
    dataChildren.splice(index, 0, childData)
  }
}

export function insertBefore(parent: any, child: any, ref: any, fieldNames: any) {
  let index
  if (ref) {
    index = parent.children.indexOf(ref)
  }
  insertChild(parent, child, index, fieldNames)
}

export function insertAfter(parent: any, child: any, ref: any, fieldNames: any) {
  let index
  if (ref) {
    index = parent.children.indexOf(ref)
    if (index !== -1) index += 1
  }
  insertChild(parent, child, index, fieldNames)
}
