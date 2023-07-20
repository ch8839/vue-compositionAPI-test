<template>
  <div style="display: inline-block; text-align: left;">
    <mtd-checkbox v-model="showTime" style="margin-bottom: 8px">在菜单栏里展示时间</mtd-checkbox>
    <mtd-checkbox-group class="demo-checkbox-group-vertical" v-model="group5" :disabled="!showTime"
      style="list-style-type: none; margin: 0; padding-left: 20px;">
      <mtd-checkbox value="number" style="display: block; margin-right: 0px;">数字时钟</mtd-checkbox>
      <mtd-checkbox value="clock" style="display: block;">拟物时钟</mtd-checkbox>
    </mtd-checkbox-group>
  </div>
</template>
<script>
export default {
  data () {
    return {
      showTime: false,
      group5: [],
    };
  },
};
</script>
