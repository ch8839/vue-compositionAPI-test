<template>
  <mtd-autocomplete  v-model="autoValue" placeholder="请输入"
    @search="handleSearch" @select="handleSelect" >
      <mtd-option v-for="email in data" 
      :key="email" 
      :label="email"
      :value="email" >
          {{ email }}
      </mtd-option>
    </mtd-autocomplete>
</template>
<script>
export default {
  data () {
    return {
      data: [],
      autoValue: '',
    };
  },
  methods: {
    handleSearch(value) {
      let result;
      if (!value || value.indexOf('@') >= 0) {
        result = [];
      } else {
        result = ['gmail.com', '163.com', 'qq.com'].map(domain => `${value}@${domain}`);
      }
      this.data = result;
    },
    handleSelect (value) {
      console.log('select', value);
    },
  },
};
</script>
