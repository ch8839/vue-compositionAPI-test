<template>
  <div class="demo-flex">

    <div style="text-align:left">
      <h4>基础型</h4><br>
      <mtd-radio-group v-model="value">
        <mtd-radio value="beijing">北京</mtd-radio>
        <mtd-radio value="shanghai">上海</mtd-radio>
      </mtd-radio-group>
      <br><br>
      <mtd-radio-group v-model="value" class="demo-radio-group-vertical">
        <mtd-radio value="beijing">北京</mtd-radio>
        <mtd-radio value="shanghai">上海</mtd-radio>
      </mtd-radio-group>
    </div>

    <div style="text-align:left">
      <h4>大型</h4><br>
      <mtd-radio-group v-model="value" size="large">
        <mtd-radio value="beijing">北京</mtd-radio>
        <mtd-radio value="shanghai">上海</mtd-radio>
      </mtd-radio-group>
      <br><br>
      <mtd-radio-group v-model="value" class="demo-radio-group-vertical" size="large">
        <mtd-radio value="beijing">北京</mtd-radio>
        <mtd-radio value="shanghai">上海</mtd-radio>
      </mtd-radio-group>
    </div>
   
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
  
  .mtd-radio{
    margin-bottom: 8px;
  }
}
</style>
