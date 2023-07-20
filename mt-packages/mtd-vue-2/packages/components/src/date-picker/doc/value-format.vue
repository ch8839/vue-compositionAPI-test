<template>
  <div>
    <mtd-row>
      <mtd-col :span="8">
        <p>Date 对象</p>
        <div>{{ value1 }}</div>
        <mtd-date-picker
          type="datetime"
          v-model="value1"
          placeholder="选择时间"
        />
      </mtd-col>
      <mtd-col :span="8">
        <p>String 格式</p>
        <div>{{ value2 }}</div>
        <mtd-date-picker
          type="date"
          v-model="value2"
          value-format="yyyy-MM-dd"
          placeholder="选择时间"
        />
      </mtd-col>
      <mtd-col :span="8">
        <p>时间戳格式</p>
        <div>{{ value3 }}</div>
        <mtd-date-picker
          type="datetime"
          v-model="value3"
          value-format="timestamp"
          placeholder="选择时间"
        />
      </mtd-col>
    </mtd-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value1: new Date(),
      value2: '2020-08-31',
      value3: new Date().getTime(),
    };
  },
};
</script>
