<template>
  <div>
    <div class="demo-picker-group">
      <p>小号</p>
      <mtd-date-picker
        type="date"
        size="small"
        v-model="value3"
        placeholder="选择时间"
      />
    </div>
    <div class="demo-picker-group">
      <p>默认</p>
      <mtd-date-picker type="date" v-model="value4" placeholder="选择时间" />
    </div>
    <div class="demo-picker-group">
      <p>大号</p>
      <mtd-date-picker
        type="date"
        size="large"
        v-model="value5"
        placeholder="选择时间"
      />
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
