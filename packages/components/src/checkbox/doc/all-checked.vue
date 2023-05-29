<template>
  <div class="demo-flex">
    <div class="example-checkbox-all">
      <mtd-checkbox v-model="checkedAll"
        @input="handleCheckedAll"
        :indeterminate="isIndeterminate"
        style="margin-right: 32px;">全选</mtd-checkbox>
      <mtd-checkbox-group v-model="group3" @input="handleCheckItem">
        <mtd-checkbox v-for="t in options" :key="t" :value="t">{{ t }}</mtd-checkbox>
      </mtd-checkbox-group>
    </div>
    <div class="example-checkbox-all checkbox-vertical">
      <mtd-checkbox v-model="checkedAll2"
        @input="handleCheckedAll2"
        :indeterminate="isIndeterminate2">全选</mtd-checkbox>
      <mtd-checkbox-group 
        style="list-style-type: none; margin: 0; padding-left: 20px;"
        v-model="group4" 
        @input="handleCheckItem2">
        <mtd-checkbox v-for="t in options" :key="t" :value="t"
          style="margin-right: 0px;">{{ t }}</mtd-checkbox>
      </mtd-checkbox-group>
    </div>
  </div>
</template>
<script>
const options = ['上海', '北京', '广州'];
export default {
  data () {
    return {
      options,
      checkedAll: false,
      checkedAll2: false,
      group3: [],
      group4: [],
    };
  },
  computed: {
    isIndeterminate () {
      const { length } = this.group3;
      return !!length && length !== this.options.length;
    },
    isIndeterminate2 () {
      const { length } = this.group4;
      return !!length && length !== this.options.length;
    },
  },
  methods: {
    handleCheckedAll (checked) {
      this.group3 = checked ? this.options : [];
    },
    handleCheckItem (items) {
      this.checkedAll = items.length === this.options.length;
    },
    handleCheckedAll2 (checked) {
      this.group4 = checked ? this.options : [];
    },
    handleCheckItem2 (items) {
      this.checkedAll2 = items.length === this.options.length;
    },
  },
};
</script>

<style lang='scss'>
  .example-checkbox-all{
    text-align: left;
    display: inline-block;
    .mtd-checkbox-group{
      display: inline-block;
    }
  }
</style>
