<template>
  <mtd-transfer
    :data="initData"
    :props="customProps"
    v-model="checkedData" />
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
      customProps: {
        key: 'customKey',
        label: 'customLabel',
        disabled: 'customDisabled',
      },
      checkedData: [],
      initData: [
        {
          customLabel: 'item-1',
          customKey: 'value-1',
          customDisabled: false,
        },
        {
          customLabel: 'item-2',
          customKey: 'value-2',
          customDisabled: false,
        },
        {
          customLabel: 'item-3',
          customKey: 'value-3',
          customDisabled: false,
        },
      ],
    };
  },
};
</script>
