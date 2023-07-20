<template>
  <div class="demo-flex">
    <mtd-radio-group v-model="value" @change="t">
      <mtd-radio value="beijing">北京</mtd-radio>
      <mtd-radio value="shanghai">上海</mtd-radio>
    </mtd-radio-group>

    <mtd-radio-group v-model="value" class="demo-radio-group-vertical">
      <mtd-radio value="beijing">北京</mtd-radio>
      <mtd-radio value="shanghai">上海</mtd-radio>
    </mtd-radio-group>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: "beijing",
    };
  },
  methods: {
    t(v) {
      console.log("change", v, this.value);
    },
  },
};
</script>
<style lang="scss">
.demo-radio-group-vertical{
  display: inline-flex;
  flex-direction: column;
  
  .mtd-radio-normal{
    margin-bottom: 8px;
  }
}
</style>
