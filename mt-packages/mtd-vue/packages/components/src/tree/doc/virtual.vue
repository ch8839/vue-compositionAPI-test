<template>
<div style="width:300px;">
  <mtd-tree
    :data="data" 
    node-key="label"
    style="height: 360px"
    virtual
    default-expand-all
  />
</div>
</template>
<script>
function dig(path = '0', level = 3) {
  const list= []
  for (let i = 0; i < 10; i += 1) {
    const key = `${path}-${i}`
    const treeNode = {
      label: key,
      key,
    }

    if (level > 0) {
      treeNode.children = dig(key, level - 1)
    }

    list.push(treeNode)
  }
  return list
}

export default {
  data () {
    return {
      value: [],
      expandedKeys: ['0-3'],
      data: dig(),
    }
  },
}
</script>
