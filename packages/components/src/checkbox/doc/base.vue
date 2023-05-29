<template>
  <div 
  class="demo-full-width"
  style="text-align: left;display: flex;align-items: center;justify-content: space-around">
    <mtd-checkbox v-model:value="checked" v-model="checked" @change="handleChange">只有一个选项</mtd-checkbox>
    <mtd-checkbox 
      v-model="value"
      v-model:value="value"
      :true-value="1"
      :false-value="0"
    >
      自定义value
    </mtd-checkbox>

    <mtd-checkbox-group class="checkbox-vertical" v-model="group" @change="handleChange">
      <mtd-checkbox value="1">选项 1</mtd-checkbox>
      <mtd-checkbox value="2">选项 2</mtd-checkbox>
      <mtd-checkbox value="3">选项 3</mtd-checkbox>
    </mtd-checkbox-group>
  </div>
</template>
<script>
export default {
  data () {
    return {
      checked: false,
      value: 1,
      group: [],
    }
  },
  methods: {
    handleChange(v) {
      console.log('你选择',v)
    },
  },
}
</script>
<style>
  .checkbox-vertical{
    width: 100px;
  }
  .checkbox-vertical .mtd-checkbox{
    display: block;
    margin-left: 0px;
    margin-bottom: 8px;
  }
</style>
