<template>
  <mtd-tree :data="data" node-key="label"
    default-expand-all :props="{ children: 'subMenus' }" />
</template>
<script>
export default {
  data () {
    return {
      data: [{
        label: '唐诗',
        subMenus: [{
          label: 'parent 1-1',
          subMenus: [{
            label: 'leaf 1-1-1',
          }, {
            label: 'leaf 1-1-2',
          }],
        }, {
          label: 'parent 1-2',
          subMenus: [{
            label: 'leaf 1-2-1',
          }],
        }],
      }, {
        label: '宋词',
        subMenus: [{
          label: '苏轼',
          subMenus: [{
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
