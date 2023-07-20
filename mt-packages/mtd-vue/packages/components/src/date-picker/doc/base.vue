<template>
  <div class="demo-picker-group">
    <p>日期选择框</p>
    <mtd-date-picker type="datetime" v-model="value1" placeholder="选择时间" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      value1: new Date(),
    };
  },
};
</script>
