<template>
  <div class="demo-box">
    <div class="demo-slider" style="margin-bottom: 20px">
      正常态
      <mtd-slider v-model="value" />
    </div>
    <div class="demo-slider">
      禁用态
      <mtd-slider disabled v-model="value2" />
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value: 30,
      value2: 30,
    };
  },
};
</script>
