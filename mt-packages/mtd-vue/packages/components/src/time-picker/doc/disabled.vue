<template>
  <div>
    <div class="demo-picker-group">
      <p>禁用时间</p>
      <mtd-time-picker
        v-model="value"
        placeholder="选择时间"
        :disabled-hours="[1, 5,6,7,8, 10]"
        :disabled-minutes="[0, 10, 20]"
      />
    </div>
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
