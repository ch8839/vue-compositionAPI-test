<template>
  <div class="mtd-row">
    <div class="mtd-col-8">
      <p>小号</p>
      <mtd-time-picker size="small" v-model="value3" placeholder="选择时间" />
    </div>
    <div class="mtd-col-8">
      <p>默认</p>
      <mtd-time-picker v-model="value4" placeholder="选择时间" />
    </div>
    <div class="mtd-col-8">
      <p>大号</p>
      <mtd-time-picker size="large" v-model="value5" placeholder="选择时间" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value3: new Date(),
      value4: new Date(),
      value5: new Date(),
    };
  },
};
</script>
