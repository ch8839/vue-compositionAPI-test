<template>
  <div class="demo-flex">

    <div style="text-align:left">
      <h4>基础型</h4><br>
      <mtd-checkbox v-model="checkValue" >北京</mtd-checkbox>
      <br><br><br>
      <mtd-checkbox-group v-model="value">
        <mtd-checkbox value="beijing">北京</mtd-checkbox>
        <mtd-checkbox value="shanghai">上海</mtd-checkbox>
        <mtd-checkbox value="shenzhen">深圳</mtd-checkbox>
      </mtd-checkbox-group>
      <br><br>
      <mtd-checkbox-group v-model="value" class="demo-checkbox-group-vertical">
        <mtd-checkbox value="beijing">北京</mtd-checkbox>
        <mtd-checkbox value="shanghai">上海</mtd-checkbox>
        <mtd-checkbox value="shenzhen">深圳</mtd-checkbox>
      </mtd-checkbox-group>
    </div>

    <div style="text-align:left">
      <h4>大型</h4><br>
      <mtd-checkbox v-model="checkValue" size="large">北京</mtd-checkbox>
      <br><br><br>
      <mtd-checkbox-group v-model="value" size="large">
        <mtd-checkbox value="beijing">北京</mtd-checkbox>
        <mtd-checkbox value="shanghai">上海</mtd-checkbox>
        <mtd-checkbox value="shenzhen">深圳</mtd-checkbox>
      </mtd-checkbox-group>
      <br><br>
      <mtd-checkbox-group v-model="value" class="demo-checkbox-group-vertical" size="large">
        <mtd-checkbox value="beijing">北京</mtd-checkbox>
        <mtd-checkbox value="shanghai">上海</mtd-checkbox>
        <mtd-checkbox value="shenzhen">深圳</mtd-checkbox>
      </mtd-checkbox-group>
    </div>
   
  </div>
</template>
<script>
export default {
  data() {
    return {
      checkValue: false,
      value: [],
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
.demo-checkbox-group-vertical{
  display: flex;
  flex-direction: column;
  
  .mtd-checkbox{
    margin-bottom: 8px;
  }
}
</style>
