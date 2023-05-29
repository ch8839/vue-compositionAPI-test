<template>
  <div>
    <div class="demo-picker-group">
      <p>按周选择</p>
      <mtd-date-picker
        type="week"
        v-model="value3"
        placeholder="选择时间"
        format="yyyy年WW周"
      />
    </div>
    <div class="demo-picker-group">
      <p>按月选择</p>
      <mtd-date-picker
        type="month"
        v-model="value1"
        placeholder="选择时间"
        format="yyyy年MM月"
      />
    </div>
    <div class="demo-picker-group">
      <p>按年选择</p>
      <mtd-date-picker
        type="year"
        v-model="value2"
        placeholder="选择时间"
        format="yyyy年"
      />
    </div>
    <div class="demo-picker-group">
      <p>按季度选择</p>
      <mtd-date-picker
        type="quarter"
        v-model="value4"
        placeholder="选择时间"
        format="yyyy年第Q季度"
      />
    </div>
    <div class="demo-picker-group">
      <p>按半年选择</p>
      <mtd-date-picker
        type="halfyear"
        v-model="value5"
        placeholder="选择时间"
        format="yyyy年G"
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
      value3: new Date(),
      value4: new Date(),
      value5: new Date(),
    };
  },
};
</script>
