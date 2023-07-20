<template>
  <div>
    <div class="demo-picker-group">
      <p>精确到天</p>
      <mtd-date-picker type="date" v-model="value1" placeholder="选择时间" />
    </div>
    <div class="demo-picker-group">
      <p>精确到时间</p>
      <mtd-date-picker
        type="datetime"
        v-model="value2"
        placeholder="选择时间"
        format="yyyy-MM-dd HH:mm"
        :time-picker-options="{ format: 'HH:mm' }"
      />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value1: new Date(),
      value2: new Date(),
    };
  },
};
</script>
