<template>
<div style="width:400px">
  <mtd-tree :data="data"
    :load-data="loadData" />
</div>
</template>
<script>
export default {
  data () {
    return {
      data: [{
        label: '唐诗',
        id: '0',
      }, {
        label: '宋词',
        id: '1',
      }, {
        label: '绝句',
        id: '2',
      }],
    };
  },
  methods: {
    loadData (node, callback) {
      setTimeout(() => {
        const { data: { id } } = node;
        const item = [
          {
            label: 'children',
            id: `${id}-1`,
          },
          {
            label: 'children',
            id: `${id}-2`,
          },
        ];
        callback(item);
      }, 1000);
    },
  },
};
</script>
