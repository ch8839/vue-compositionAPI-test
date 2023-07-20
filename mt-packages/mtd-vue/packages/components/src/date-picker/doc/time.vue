<template>
  <div class="demo-picker-group">
    <p>时间点选择</p>
    <mtd-time-picker type="time" v-model="value" placeholder="选择时间" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: new Date(),
    };
  },
};
</script>
