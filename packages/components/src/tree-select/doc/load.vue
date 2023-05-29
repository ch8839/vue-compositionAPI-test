<template>
  <div>
    <p>动态加载</p>
    <mtd-tree-select
      :data="options"
      :load-data="loadData"
      @change="handleChange"
      v-model="value"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: [],
      options: [
        {
          value: 'zhejiang',
          label: 'Zhejiang',
          isLeaf: false,
        },
        {
          value: 'jiangsu',
          label: 'Jiangsu',
          isLeaf: false,
        },
      ],
    };
  },
  methods: {
    handleChange(value) {
      console.log(value);
    },
    loadData(item, callback) {
      setTimeout(() => {
        callback([
          {
            label: `${item.label} Dynamic 1`,
            value: 'dynamic1',
            isLeaf: true,
          },
          {
            label: `${item.label} Dynamic 2`,
            value: 'dynamic2',
            isLeaf: true,
          },
        ]);
      }, 1000);
    },
  },
};
</script>
