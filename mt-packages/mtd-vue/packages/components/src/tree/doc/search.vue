<template>
<div class="demo-filter-tree">
  <mtd-input v-model="query" class="demo-filter"
    placeholder="search" />
  <mtd-tree :data="data" node-key="label"
    :expanded-keys.sync="expandedKeys">
    <template slot-scope="scope">
      <text-highlight :queries="[query]">{{ scope.node.label }}</text-highlight>
    </template>
  </mtd-tree>
</div>
</template>
<script>
import TextHighlight from 'vue-text-highlight';
export default {
  components: {
    TextHighlight,
  },
  data () {
    return {
      query: '',
      expandedKeys: [],
      data: [{
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
          label: '苏轼 1-1',
          children: [{
            label: '东坡乐府 1-2',
          }, {
            label: '赤壁怀古 1-3',
          }],
        }],
      }, {
        label: '绝句',
      }],
    };
  },
  watch: {
    query (v) {
      if (v) {
        this.handleQuery();
      }
    },
  },
  methods: {
    filterNode (item) {
      return item.label.indexOf(this.query) > -1;
    },
    handleQuery () {
      const expandedKeys = [];
      const reduce = (state, data, parent) => {
        let result = false;
        data.forEach((item) => {
          if (item.children && reduce(state, item.children, item)) {
            result = true;
            state.push(item.label);
          } else if (this.filterNode(item)) {
            result = true;
          }
        });
        return result;
      };
      reduce(expandedKeys, this.data);
      this.expandedKeys = expandedKeys;
    },
  },
};
</script>
<style lang="scss">
  .demo-tree .demo-filter-tree{
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
