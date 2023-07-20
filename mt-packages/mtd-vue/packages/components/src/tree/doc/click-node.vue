<template>
  <mtd-row :gutter="20">
    <mtd-col :span="12">
      <p>节点有详情，点击三角展开子项。</p>
      <mtd-tree :data="data"
        node-key="label"
        :expand-on-click-node="false"
        :expanded-keys.sync="expandedKeys" />
    </mtd-col>
    <mtd-col :span="12">
      <p>节点无详情，点击整行展开子项。</p>
      <mtd-tree :data="data"
        :expanded-keys.sync="expandedKeys2"
        node-key="label" />
    </mtd-col>
  </mtd-row>
</template>
<script>
export default {
  data () {
    return {
      expandedKeys: ['宋词', '苏轼'],
      expandedKeys2: ['宋词', '苏轼'],
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
    };
  },
};
</script>
