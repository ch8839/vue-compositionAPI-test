<template>
<div style="width:400px">
  <mtd-tree
    :data="data"
    node-key="label"
    :expanded-keys.sync="expandedKeys"
    v-model:expanded-keys="expandedKeys" 
  />
</div>
</template>
<script>
export default {
  data () {
    return {
      value: [],
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
          label: '苏轼',
          children: [{
            label: '东坡乐府',
          }, {
            label: '赤壁怀古',
          }],
        }],
      }, {
        label: '绝句',
      }],
    }
  },
}
</script>
