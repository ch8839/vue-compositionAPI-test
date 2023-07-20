<template>
  <mtd-autocomplete :data="options"
    v-model="value" placeholder="请输入"
    @search="handleSearch" />
</template>
<script>
export default {
  data () {
    return {
      options: [],
      value: '',
    };
  },
  methods: {
    handleSearch (query) {
      clearTimeout(this.timer);
      if (!query) {
        this.options = [];
      } else {
        this.timer = setTimeout(() => {
          this.options = query.split('').map((v, index) => {
            return query.slice(0, index + 1);
          });
        }, 1000);
      }
    },
  },
};
</script>
