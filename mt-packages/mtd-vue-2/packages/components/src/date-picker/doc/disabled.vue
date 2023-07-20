<template>
  <div
    class="demo-picker-group"
    style="display: flex; justify-content: space-around;"
  >
    <div>
      <p>禁用日期</p>
      <mtd-date-picker
        type="date"
        v-model="value"
        placeholder="选择日期"
        :options="options"
      />
    </div>
    <div>
      <p>禁用日期和时间</p>
      <mtd-date-picker
        type="datetime"
        v-model="value"
        placeholder="选择日期"
        format="yyyy-MM-DD HH:mm"
        :time-picker-options="{
          'disabled-hours': [1, 5, 10],
          'disabled-minutes': [0, 10, 20],
          format: 'HH:mm',
        }"
        :options="options2"
      />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: new Date(),
      options: {
        disabledDate(date) {
          return date && date.getTime() > Date.now();
        },
      },
      options2: {
        disabledDate(date) {
          return date && date.getTime() > Date.now();
        },
      },
    };
  },
};
</script>
