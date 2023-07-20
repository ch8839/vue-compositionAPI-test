<template>
  <div class="example-list-item">
    <mtd-radio-group v-model="value4">
      <mtd-radio-button value="beijing">北京</mtd-radio-button>
      <mtd-radio-button value="shanghai">上海</mtd-radio-button>
      <mtd-radio-button value="shenzhen">深圳</mtd-radio-button>
    </mtd-radio-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value4: 'beijing',
    };
  },
};
</script>
