<template>
  <mtd-tree 
    checkable 
    :data="data" 
    node-key="label"
    :expanded-keys.sync="expandedKeys"
    v-model:expanded-keys="expandedKeys" 
    :checked-keys.sync="checkedKeys"
    v-model:checked-keys="checkedKeys" 
    checked-strategy="parent">
    <div slot-scope="scope" slot="extend">
      <div v-if="!scope.node.children && scope.node.checked">
        开通城市 <mtd-select>
          <mtd-option value="北京" label="北京" />
          <mtd-option value="上海" label="上海" />
          <mtd-option value="漯河" label="漯河" />
        </mtd-select>
      </div>
    </div>
  </mtd-tree>
</template>
<script>
export default {
  data () {
    return {
      expandedKeys: [],
      checkedKeys: [],
      data: [{
        label: 'parent 1',
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
          }, {
            label: 'leaf 1-2-2',
          }],
        }],
      }],
    }
  },
}
</script>
