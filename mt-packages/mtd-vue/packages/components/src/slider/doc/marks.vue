<template>
  <div class="demo-box">
    <mtd-row type="flex" class="demo-slider-row" style="width: 100%">
      <mtd-col :span="3">
        <span>温度：</span>
      </mtd-col>
      <mtd-col :span="16" >
        <mtd-slider :marks="marks" v-model="value" :formatTooltip="(val) => `${val} ℃`"/>
      </mtd-col>
    </mtd-row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value: 37,
      marks: {
        0: '0°C',
        26: '26°C',
        37: '37°C',
        100: '100°C',
      },
    };
  },
};
</script>
