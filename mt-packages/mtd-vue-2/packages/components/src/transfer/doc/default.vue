<template>
    <mtd-transfer
      :data="initData"
      v-model="value"
      :source-default-checked="sourceDefaultChecked"
      :target-default-checked="targetDefaultChecked" />
</template>
<script>
export default {
  data () {
    return {
      value: ['value-2', 'value-3'],
      initData: [
        {
          label: 'helloworldhelloworldhelloworld',
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
      sourceDefaultChecked: ['value-1'],
      targetDefaultChecked: ['value-2'],
    };
  },
};
</script>
