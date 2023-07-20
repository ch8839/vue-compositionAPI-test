<template>
  <div class="demo-full-width">
    <mtd-row class="example-row" :gutter="20">
      <mtd-col :span="8">
        <p>all (默认)</p>
        <mtd-tree :data="data"
          node-key="label"
          checkable
          @toggle-checked="handleChekced" />
      </mtd-col>
      <mtd-col :span="8">
        <p>parent</p>
        <mtd-tree :data="data"
          checked-strategy="parent"
          node-key="label"
          checkable
          @toggle-checked="handleChekced" />
      </mtd-col>
      <mtd-col :span="8">
        <p>children</p>
        <mtd-tree :data="data"
          checked-strategy="children"
          node-key="label"
          checkable
          @toggle-checked="handleChekced" />
      </mtd-col>
    </mtd-row>
  </div>
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
  methods: {
    handleChekced (keys, extra) {
      console.log('keys:', keys, 'extra', extra);
    },
  },
};
</script>
