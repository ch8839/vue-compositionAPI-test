<template>
  <div>
    <div class="type-and-use-size">
      <p>本地搜索</p>
      <mtd-select
        v-model="value"
        class="select-width"
        :filterable="true"
        :options="options"
        multiple
        reserve-keyword
        :clearable="false"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </div>
  </div>
</template>
<script>
import User from "./user.json";

export default {
  data() {
    const options = User.data;
    return {
      options: options,
      options2: options,
      value: "",
      value2: undefined,
      loading: false,
    };
  },
  methods: {
    remoteMethod(query) {
      clearTimeout(this.remoteTimer);
      this.loading = false;
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
      }
    },
    handleFocus(e) {
      // console.log('focus', e);
    },
    handleBlur(e) {
      // console.log('blur', e);
    },
  },
};
</script>
<style lang="scss">
.type-and-use-size p {
  font-size: 14px;
  color: #464646;
  letter-spacing: 0;
}
.type-and-use-size {
  margin: 0 20px;
  display: inline-block;
  width: 25%;
  text-align: left;
  vertical-align: top;
}
</style>
