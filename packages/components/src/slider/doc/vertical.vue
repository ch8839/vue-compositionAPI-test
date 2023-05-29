<template>
  <div class="demo-vertical-box">
    <mtd-slider
      v-model="value"
      vertical />
    <mtd-slider
      v-model="value2"
      vertical
      :step="20" />
  </div>
</template>
<script>
export default {
  data () {
    return {
      value: 20,
      value2: 20,
    };
  },
};
</script>
<style lang="scss">
  .demo-vertical-box {
    .mtd-slider-vertical {
      height: 260px;
      display: inline-block;
      margin-right: 100px;
    }
  }
</style>
