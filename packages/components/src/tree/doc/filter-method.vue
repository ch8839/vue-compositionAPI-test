<template>
  <div class="demo-tree-filter-method">
    <mtd-input
      class="demo-filter"
      placeholder="输入关键字进行过滤"
      v-model="filterText"
    />

    <mtd-tree
      class="filter-tree"
      :data="data"
      empty-text="暂无数据"
      default-expand-all
      :filter-node-method="filterNode"
      ref="tree" />
  </div>
</template>

<script>
export default {

  data () {
    return {
      filterText: '',
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1',
          }, {
            id: 10,
            label: '三级 1-1-2',
          }],
        }],
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1',
        }, {
          id: 6,
          label: '二级 2-2',
        }],
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1',
        }, {
          id: 8,
          label: '二级 3-2',
        }],
      }],
    };
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val);
    },
  },

  methods: {
    filterNode (value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
  },
};
</script>
<style lang="scss">
  .demo-tree .demo-tree-filter-method{
    text-align: left;
    width: 300px;
    .demo-filter{
      width: 100%;
      margin-bottom: 12px;
    }
    .mtd-tree{
      border: none;
    }
  }
</style>
