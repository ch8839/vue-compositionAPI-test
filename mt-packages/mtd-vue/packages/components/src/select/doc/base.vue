<template>
  <div>
    <mtd-select v-model="value" style="width: 200px">
      <mtd-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled" />
    </mtd-select>
  </div>
</template>
<script>
export default {
  name: 'DemoSelectBase',
  data () {
    return {
      options: [{
        value: '李白',
        label: '李白',
      }, {
        value: '李贺',
        label: '李贺',
      }, {
        value: '杜甫',
        label: '杜甫',
        disabled: true,
      }, {
        value: '白居易',
        label: '白居易',
      }, {
        value: '屈原',
        label: '屈原',
      }],
      value: '',
    };
  },
};
</script>