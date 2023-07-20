<template>
  <div
    class="demo-picker-group"
  >
    <div>
      <p>时间选择框</p>
      <mtd-time-picker
        type="time"
        v-model="value1"
        value-format="HH:mm:ss"
        placeholder="选择时间"
        :clearable="true"
        @change="handleChange"
      />
    </div>
    <br>
    <div style="">
      <p>时间范围选择框</p>
      <mtd-time-picker
        type="timerange"
        v-model="value2"
        :placeholder="['开始时间','结束时间']"
        :clearable="true"
        @change="handleChange"
        style="width:200px"
      />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value1: new Date(),
      value2: [],
    }
  },
  methods: {
    handleChange(v) {
      console.log('change', v)
    },
  },
}
</script>
