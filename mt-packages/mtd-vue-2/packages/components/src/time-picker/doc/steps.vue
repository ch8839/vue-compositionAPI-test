<template>
  <div class="demo-picker-group">
    <p>时间选择框</p>
    <mtd-time-picker
      type="time"
      v-model="value"
      placeholder="选择时间"
      :steps="[1, 5, 10]"
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
