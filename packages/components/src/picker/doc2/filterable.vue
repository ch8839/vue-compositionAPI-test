<template>
  <div>
    <mtd-picker
      :options="options"
      clearable
      filterable
      :reserve-keyword="true"
      show-select-all
      placeholder="请选择"
      multiple
      v-model="value"
    />
    <mtd-picker
      :options="options"
      clearable
      filterable
      :reserve-keyword="true"
      show-select-all
      placeholder="请选择"
      multiple
      v-model="value2"
      remote
      :remote-method="searchCity"
      :loading="loading"
    />
  </div>
</template>
<script>
import User from "./user.json";

export default {
  data() {
    const options = User.data;
    return {
      value: [],
      value2: [],
      loading: false,
      options: options,
      options2: options,
    };
  },
  methods: {
    searchCity(query) {
      clearTimeout(this.remoteTimer);
      if (query) {
        this.loading = true;
        this.remoteTimer = setTimeout(() => {
          this.options2 = this.options.filter((item) => {
            return (
              item.label.toLowerCase().indexOf(query && query.toLowerCase()) >
              -1
            );
          });
          this.loading = false;
        }, 2000);
      } else {
        this.options2 = this.options;
        this.loading = false;
      }
    },
  },
};
</script>
