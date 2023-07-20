<template>
  <mtd-autocomplete v-model="autoValue"
    @search="handleSearch"
    placeholder="请输入">
    <mtd-option v-for="(item, i) in options"
      :key="i"
      :label="item.label"
      :value="item.value" />
  </mtd-autocomplete>
</template>
<script>
export default {
  data () {
    return {
      options: [],
      autoValue: '',
    };
  },
  methods: {
    handleSearch (value) {
      this.options = value.split('').map((v, index) => {
        return {
          label: value.slice(0, index + 1),
          value: value.slice(0, index + 1),
        };
      });
    },
  },
};
</script>
