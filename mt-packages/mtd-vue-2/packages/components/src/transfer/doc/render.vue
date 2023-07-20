<template>
  <mtd-transfer
    :data="initData"
    v-model="checkedData">
    <template v-slot="scope">
      <h5 style="display: inline-block; margin-bottom: 0">
        {{ scope.row.label }}
      </h5>
    </template>
  </mtd-transfer>
</template>
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
};
</script>
