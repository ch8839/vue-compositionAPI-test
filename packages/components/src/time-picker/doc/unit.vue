<template>
  <div class="demo-picker-group">
    <p>时间精确到分钟</p>
    <mtd-time-picker
      type="time"
      v-model="value"
      placeholder="选择时间"
      format="HH:mm"
    /><br><br>
    <p>时间精确到小时</p>
    <mtd-time-picker
      type="time"
      v-model="value"
      placeholder="选择时间"
      format="HH"
    />
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