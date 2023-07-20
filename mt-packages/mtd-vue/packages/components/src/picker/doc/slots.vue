<template>
  <mtd-row style="width:100%">
    <mtd-col :span="8">
      <p>超出省略</p>
      <mtd-picker
        multiple
        clearable
        placeholder="请选择"
        v-model="value"
        tooltip
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
      <p>显示数量</p>
      <mtd-picker
        clearable
        show-select-all
        placeholder="请选择"
        :max-count="2"
        multiple
        tooltip
        v-model="value2"
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
      <p>自定义显示</p>
      <mtd-picker multiple clearable placeholder="请选择" v-model="value3">
        <template #selected>城市</template>
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
      value: [],
      value2: [],
      value3: [],
    };
  },
};
</script>
