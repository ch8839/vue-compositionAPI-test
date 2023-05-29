<template>
  <div style="width:400px">
    <mtd-tree
     checkable
      :data="data"
       node-key="id"
      :expanded-keys.sync="expandedKeys"
      v-model:expanded-keys="expandedKeys" 
      :checked-keys.sync="checkedKeys"
      v-model:checked-keys="checkedKeys" 
      checked-strategy="children"
      class="demo-custom-tree">
      <template #default="{ node, data }">
        <div class="demo-tree-space-between">
          <span v-if="!data.edit">{{ data.label }}</span>
          <mtd-input
            v-else 
            size="small"
            v-model="data.tempTitle" 
            autofocus
            @blur="saveTitle(data)" />
          <span class="demo-tree-action" v-if="node.level > 0">
            <mtd-icon-button
              size="small"
              icon="edit-o"
              @click.stop="editNode(node, data)"
            />
            <mtd-icon-button
              size="small"
              icon="delete-o" 
              @click.stop="removeNode(node, data)" 
            />
          </span>
        </div>
      </template>
    </mtd-tree>
  </div>
</template>
<script>
export default {
  data () {
    return {
      expandedKeys: [],
      checkedKeys: [],
      editItem: null,
      data: [{
        label: 'parent 1',
        id: 'parent 1',
        children: [{
          label: 'parent 1-1',
          id: 'parent 1-1',
          disabled: true,
          children: [{
            label: 'leaf 1-1-1',
            id: 'leaf 1-1-1',
          }, {
            label: 'leaf 1-1-2',
            id: 'leaf 1-1-2',
          }],
        }, {
          label: 'parent 1-2',
          id: 'parent 1-2',
          children: [{
            label: 'leaf 1-2-1',
            id: 'leaf 1-2-1',
          }, {
            label: 'leaf 1-2-2',
            id: 'leaf 1-2-2',
          }],
        }],
      }],
    }
  },
  methods: {
    saveTitle (data) {
      data.label = data.tempTitle
      data.edit = false
      this.editItem = null
    },
    editNode (node, data) {
      if (this.editItem) {
        // 此处也可以给提示
        this.saveTitle(this.editItem)
      }
      this.editItem = data
      this.$set(data, 'tempTitle', data.label)
      this.$set(data, 'edit', true)
    },
    removeNode (node, data) {
      this.$mtd.confirm({
        label: '确认删除？',
        type: 'error',
        showCancelButton: true,
        okButtonProps: {
          type: 'danger',
        },
        cancelButtonProps: {
          type: 'text',
        },
      }).then(() => {
        const { $parent } = node
        const parentData = $parent ? $parent.data.children : this.data
        parentData.splice(parentData.indexOf(data), 1)
      })
    },
  },
}
</script>
<style lang='scss'>
  .demo-tree-space-between{
    display: flex;
    align-items: center;
    justify-content: space-between;
    .mtd-input-small{
      font-size: 14px;
      margin-top: -3px;
      margin-bottom: -3px;
    }
  }
  .demo-tree-action{
    margin-right: 20px;
    visibility: hidden;
    opacity: 0;
    display: inline-flex;
    .mtd-icon-btn{
      width: 20px;
      height: 20px;
      padding: 3px;
      font-size: 14px;
    }
  }
  .demo-custom-tree{
    .mtd-tree-node-content:hover{
      .demo-tree-action{
        opacity: 1;
        visibility: visible;
      }
    }
    .mtd-tree-node-disabled .mtd-tree-node-content{
      .demo-tree-action{
        visibility: hidden;
      }
    }
  }
</style>
