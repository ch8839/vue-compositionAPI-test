<template>
  <div class="demo-flex">
    <mtd-picker clearable placeholder="请选择" v-model="value2">
      <mtd-option value="北京">北京</mtd-option>
      <mtd-option value="上海">上海</mtd-option>
      <mtd-option value="广州">广州</mtd-option>
      <mtd-option value="杭州">杭州</mtd-option>
      <mtd-option value="成都">成都</mtd-option>
      <mtd-option value="深圳">深圳</mtd-option>
      <mtd-option value="南京">南京</mtd-option>
    </mtd-picker>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <mtd-picker
      clearable
      show-select-all
      placeholder="请选择"
      multiple
      v-model="value"
    >
      <mtd-option value="北京">北京</mtd-option>
      <mtd-option value="上海">上海</mtd-option>
      <mtd-option value="广州">广州</mtd-option>
      <mtd-option value="杭州">杭州</mtd-option>
      <mtd-option value="成都">成都</mtd-option>
      <mtd-option value="深圳">深圳</mtd-option>
      <mtd-option value="南京">南京</mtd-option>
    </mtd-picker>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: [],
      value2: '',
    };
  },
};
</script>
