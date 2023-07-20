<template>
  <mtd-transfer
    :data="tansferDataSource"
    disable-select-all="left"
    @change="onTransferChange"
    v-model="checkedData">
    <template
      #children="{ 
        filteredData,
        direction,
        selectedKeys,
        onItemSelect }"
     >
        <mtd-tree
          v-if="direction === 'left'"
          ref="tree"
          :data="treeData"
          node-key="label"
          checkable
          :field-names="{
            disabled: 'tree-disabled'
          }"
          @toggle-checked="(keys) => {
            onItemSelect(keys,true)
          }" 
        />
    </template>
  </mtd-transfer>
</template>
<script>

function flatten(list,result) {
  list.forEach(item => {
    item.key = item.label
    result.push(item)
    item.children && flatten(item.children,result)
  })
}

export default {
  data () {
    return {
      checkedData: [],
      treeData: [],
      tansferDataSource: [],
    }
  },

  created() {
    const originData =[{
      label: '唐诗',
      children: [{
        label: 'parent 1-1',
        children: [{
          label: 'leaf 1-1-1',
        }, {
          label: 'leaf 1-1-2',
        }],
      }, {
        label: 'parent 1-2',
        children: [{
          label: 'leaf 1-2-1',
        }],
      }],
    }, {
      label: '宋词',
      children: [{
        label: '苏轼',
        children: [{
          label: '东坡乐府',
        }, {
          label: '赤壁怀古',
        }],
      }],
    }, {
      label: '绝句',
    }]
    const transferDataSource = []
    flatten(originData,transferDataSource)
    this.treeData = originData
    this.tansferDataSource = transferDataSource
  },

  methods: {
    onTransferChange()  {
      this.handleTreeData(this.treeData)
    },
    handleTreeData(data) {
      // 选中后需要修改源数据的disabled状态避免二次选中
      data.forEach(item => {
        item['tree-disabled'] = this.checkedData.includes(item.key)
        if (item.children) {
          this.handleTreeData(item.children)
        }
      })
    },
  },
}
</script>
