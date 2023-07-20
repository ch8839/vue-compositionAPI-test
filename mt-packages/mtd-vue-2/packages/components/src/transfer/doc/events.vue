<template>
  <mtd-transfer
    :data="initData"
    v-model="checkedData"
    @change="handleChange"
    @select-change="handleSelect" />
</template>
<style scoped>
  .footer-style{
    text-align: center;
  }
</style>

<script>
export default {
  data () {
    return {
      checkedData: [],
      initData: [
        {
          label: 'item-1',
          key: 'value-1',
          disabled: false,
        },
        {
          label: 'item-2',
          key: 'value-2',
          disabled: false,
        },
        {
          label: 'item-3',
          key: 'value-3',
          disabled: false,
        },
      ],
    };
  },
  methods: {
    handleChange (targetKeys, direction, movedKeys) {
      console.log(targetKeys, direction, movedKeys);
    },
    handleSelect (targetKeys, direction) {
      console.log(targetKeys, direction);
    },
  },
};
</script>
