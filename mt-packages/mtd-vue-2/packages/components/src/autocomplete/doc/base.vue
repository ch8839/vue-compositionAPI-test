<template>
  <mtd-autocomplete :data="data" v-model="autoValue" placeholder="请输入"
    @search="handleSearch" @select="handleSelect" />
</template>
<script>
export default {
  data () {
    return {
      data: ['a','b'],
      autoValue: '',
    };
  },
  methods: {
    handleSearch (value) {
      console.log(value)
      this.data = value.split('').map((v, index) => {
        return value.slice(0, index + 1);
      }); 
    },
    handleSelect (value) {
      console.log('select', value);
    },
  },
};
</script>
