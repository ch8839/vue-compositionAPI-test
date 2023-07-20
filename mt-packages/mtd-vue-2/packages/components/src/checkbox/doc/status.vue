<template>
  <div class="demo-full-width">
    <mtd-checkbox v-model="checked5">未选项</mtd-checkbox>
    <mtd-checkbox v-model="checked6">已选项</mtd-checkbox>
    <mtd-checkbox indeterminate v-model="checked7">中间态</mtd-checkbox>
    <br/>
    <mtd-checkbox disabled>未选项</mtd-checkbox>
    <mtd-checkbox disabled :value="true">已选项</mtd-checkbox>
    <mtd-checkbox indeterminate disabled>中间态</mtd-checkbox>
  </div>
</template>
<script>
export default {
  data () {
    return {
      checked5: false,
      checked6: true,
      checked7: false,
    };
  },
};
</script>
