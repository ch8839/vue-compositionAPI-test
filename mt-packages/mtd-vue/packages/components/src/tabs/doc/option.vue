<template>
  <div style="text-align: left;"  class="demo-full-width">
    <p>选项卡型</p>
    <mtd-radio-group v-model="activeRadio">
      <mtd-radio-button value="hangzhou">杭州</mtd-radio-button>
      <mtd-radio-button value="beijing">北京</mtd-radio-button>
      <mtd-radio-button value="shanghai">上海</mtd-radio-button>
    </mtd-radio-group>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeRadio: 'hangzhou',
    };
  },
};
</script>
