<template>
  <mtd-transfer
    :data="initData"
    v-model="checkedData"
    filterable />
</template>
<script>
export default {
  data () {
    return {
      checkedData: [],
      initData: [
        {
          label: 'item-1',
          key: 1,
          disabled: false,
        },
        {
          label: 'item-2',
          key: 2,
          disabled: true,
        },
        {
          label: 'item-3',
          key: 3,
          disabled: false,
        },
        {
          label: 'item-4',
          key: 4,
          disabled: false,
        },
        {
          label: 'item-5',
          key: 5,
          disabled: false,
        },
        {
          label: 'item-6',
          key: 6,
          disabled: false,
        },
        {
          label: 'item-7',
          key: 7,
          disabled: false,
        },
        {
          label: 'item-8',
          key: 8,
          disabled: false,
        },
        {
          label: 'item-9',
          key: 9,
          disabled: false,
        },
        {
          label: 'item-10',
          key: 10,
          disabled: false,
        },
      ],
    };
  },
};
</script>
