<template>
  <div>
    <div>
      <p>精确到天</p>
      <mtd-date-picker
        type="daterange"
        v-model="values1"
        :placeholder="['开始时间','结束时间']"
        style="width: 240px;"
      />
    </div><br>
    <div>
      <p>精确到时间</p>
      <mtd-date-picker
        type="datetimerange"
        v-model="values2"
        :placeholder="['开始时间','结束时间']"
        style="width: 360px;"
      />
    </div><br>
    <div>
      <p>精确到月</p>
      <mtd-date-picker
        type="monthrange"
        v-model="values3"
        :placeholder="['开始时间','结束时间']"
        style="width: 240px;"
      />
    </div><br>
    <div>
      <p>精确到周</p>
      <mtd-date-picker
        type="weekrange"
        v-model="values4"
        :placeholder="['开始时间','结束时间']"
        style="width: 240px;"
      />
    </div><br>
    <div>
      <p>精确到季度</p>
      <mtd-date-picker
        type="quarterrange"
        v-model="values5"
        :placeholder="['开始时间','结束时间']"
        style="width: 240px;"
        format="yyyy年第Q季度"
      />
    </div><br>
    <div>
      <p>精确到半年</p>
      <mtd-date-picker
        type="halfyearrange"
        v-model="values6"
        :placeholder="['开始时间','结束时间']"
        style="width: 240px;"
        format="yyyy年G"
      />
    </div><br>
    <div>
      <p>精确到年</p>
      <mtd-date-picker
        type="yearrange"
        v-model="values7"
        :placeholder="['开始时间','结束时间']"
        style="width: 240px;"
      />
    </div><br>
  </div>
</template>
<script>
export default {
  data() {
    return {
      values1: [],
      values2: [],
      values3: [],
      values4: [],
      values5: [],
      values6: [],
      values7: [],
    }
  },
  methods: {
    handleChange(dates) {
      console.log('change to', dates)
    },
  },
}
</script>
<style lang="scss" scoped>
.demo-block-row {
  /* display: flex;
  align-items: center;
  justify-content: space-between; */
}
</style>
