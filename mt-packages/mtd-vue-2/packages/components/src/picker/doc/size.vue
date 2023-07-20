<template>
  <mtd-row style="width:100%">
    <mtd-col :span="8">
      <p>小</p>
      <mtd-picker
        clearable
        placeholder="请选择"
        v-model="value1"
        style="max-width: 150px;"
        size="small"
      >
        <mtd-option value="北京">北京</mtd-option>
        <mtd-option value="上海">上海</mtd-option>
        <mtd-option value="广州">广州</mtd-option>
        <mtd-option value="杭州">杭州</mtd-option>
        <mtd-option value="成都">成都</mtd-option>
        <mtd-option value="深圳">深圳</mtd-option>
        <mtd-option value="南京">南京</mtd-option>
      </mtd-picker>
    </mtd-col>
    <mtd-col :span="8">
      <p>默认</p>
      <mtd-picker
        clearable
        placeholder="请选择"
        v-model="value2"
        style="max-width: 150px;"
      >
        <mtd-option value="北京">北京</mtd-option>
        <mtd-option value="上海">上海</mtd-option>
        <mtd-option value="广州">广州</mtd-option>
        <mtd-option value="杭州">杭州</mtd-option>
        <mtd-option value="成都">成都</mtd-option>
        <mtd-option value="深圳">深圳</mtd-option>
        <mtd-option value="南京">南京</mtd-option>
      </mtd-picker>
    </mtd-col>
    <mtd-col :span="8">
      <p>大</p>
      <mtd-picker
        clearable
        placeholder="请选择"
        v-model="value3"
        style="max-width: 150px;"
        size="large"
      >
        <mtd-option value="北京">北京</mtd-option>
        <mtd-option value="上海">上海</mtd-option>
        <mtd-option value="广州">广州</mtd-option>
        <mtd-option value="杭州">杭州</mtd-option>
        <mtd-option value="成都">成都</mtd-option>
        <mtd-option value="深圳">深圳</mtd-option>
        <mtd-option value="南京">南京</mtd-option>
      </mtd-picker>
    </mtd-col>
  </mtd-row>
</template>
<script>
export default {
  data() {
    return {
      value1: '',
      value2: '',
      value3: '',
    };
  },
};
</script>
