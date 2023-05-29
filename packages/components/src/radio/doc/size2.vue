<template>
  <div class="demo-full-width">
    <div class="demo-props-option">
      <div>
        <span>选项卡大小：</span>
        <mtd-radio-group v-model="size">
          <mtd-radio-button value="small">小型</mtd-radio-button>
          <mtd-radio-button value="">基础型</mtd-radio-button>
          <mtd-radio-button value="large">大型</mtd-radio-button>
        </mtd-radio-group>
      </div>
    </div>
    <br><br>
    线性：  
    <mtd-radio-group v-model="value2" type="line" :size="size">
      <mtd-radio-button value="beijing">北京</mtd-radio-button>
      <mtd-radio-button value="shanghai">上海</mtd-radio-button>
      <mtd-radio-button value="guangzhou" disabled>广州</mtd-radio-button>
      <mtd-radio-button value="shenzhen">深圳</mtd-radio-button>
    </mtd-radio-group><br><br>
    填充：  
    <mtd-radio-group v-model="value2" type="fill" :size="size">
      <mtd-radio-button value="beijing">北京</mtd-radio-button>
      <mtd-radio-button value="shanghai">上海</mtd-radio-button>
      <mtd-radio-button value="guangzhou" disabled>广州</mtd-radio-button>
      <mtd-radio-button value="shenzhen">深圳</mtd-radio-button>
    </mtd-radio-group><br><br>
    滑块： 
    <mtd-radio-group v-model="value2" type="slider" :size="size">
      <mtd-radio-button value="beijing">北京</mtd-radio-button>
      <mtd-radio-button value="shanghai">上海</mtd-radio-button>
      <mtd-radio-button value="guangzhou" disabled>广州</mtd-radio-button>
      <mtd-radio-button value="shenzhen">深圳</mtd-radio-button>
    </mtd-radio-group>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value1: 'guangzhou',
      value2: 'guangzhou',
      size: '',
    };
  },
};
</script>
