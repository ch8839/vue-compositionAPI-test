<template>
  <div>
    <span class="demo-tags">标签:</span>
    <mtd-radio-group
      v-model="value5"
      size="small"
      class="demo-mtd-radio-only-text"
    >
      <mtd-radio value="beijing">北京</mtd-radio>
      <mtd-radio value="shanghai">上海</mtd-radio>
      <mtd-radio value="guangzhou">广州</mtd-radio>
      <mtd-radio value="shenzhen">深圳</mtd-radio>
      <mtd-radio value="zhuhai">珠海</mtd-radio>
    </mtd-radio-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value5: 'beijing',
    };
  },
};
</script>
<style>
.demo-mtd-radio-only-text .mtd-radio-inner {
  display: none;
}
</style>
