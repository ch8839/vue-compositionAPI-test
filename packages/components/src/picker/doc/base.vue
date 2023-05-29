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
      :options="options"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: [],
      value2: '',
      options: [
        {label: '北京',value:'北京'},
        {label: '上海',value:'上海'},
        {label: '广州',value:'广州'},
        {label: '杭州',value:'杭州'},
        {label: '成都',value:'成都'},
        {label: '深圳',value:'深圳'},
        {label: '南京',value:'南京'},
      ],
    }
  },
}
</script>
