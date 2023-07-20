<template>
  <div>
    <div class="demo-picker-group">
      <mtd-date-picker type="date"
        v-model="value"
        placeholder="选择时间"
        :options="options" />
    </div>
    <div class="demo-picker-group">
      <mtd-date-picker type="daterange"
        v-model="value2"
        placeholder="选择时间"
        :options="rangeOptions" />
    </div>
  </div>
</template>
<script>
export default {
  data () {
    const shortcuts = [{
      text: '今天',
      value () {
        return new Date();
      },
    },
    {
      text: '昨天',
      value () {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24);
        return date;
      },
    },
    {
      text: '本周',
      value () {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
        return date;
      },
    },
    ];
    const rangeShortcuts = [
      {
        text: '最近7天',
        value () {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
          return [date, new Date()];
        },
      }, {
        text: '最近30天',
        value () {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
          return [date, new Date()];
        },
      }];
    return {
      value: new Date(),
      value2: [],
      options: {
        shortcuts,
        disabledDate (date) {
          return date && date.getTime() > Date.now();
        },
      },
      rangeOptions: {
        shortcuts: rangeShortcuts,
        disabledDate (date) {
          return date && date.getTime() > Date.now();
        },
      },
    };
  },
};
</script>