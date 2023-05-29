<template>
  <div class="demo-box">
    <div class="demo-slider" style="margin-bottom: 20px">
      默认
      <mtd-slider v-model="value2" />
    </div>

    <div class="demo-slider">
      大号
      <mtd-slider v-model="value" size="large" />
    </div>
    
  </div>
</template>
<script>
export default {
  data () {
    return {
      value: 10,
      value2: 10,
    };
  },
};
</script>
