<template>
  <div class="demo-box">
    <div class="demo-slider">
      轨道无填充
      <mtd-slider v-model="value1" no-shade/>
    </div>
    <br>
    <div class="demo-slider">
      轨道为渐变
      <mtd-slider v-model="value2" noShade :thresholds="thresholds2" gradients/>
    </div>
    <br>
    <div class="demo-slider">
      轨道为色值
      <mtd-slider v-model="value3" noShade :thresholds="thresholds1"/>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value1: 10,
      value2: 10,
      value3: 10,
      thresholds1: {
        values: [25, 50, 75,100],
        colors: ['#62C0FF', '#FFCA54', '#FF9F5E','red'],
      },
      thresholds2: {
        values: [0,100],
        colors: ['#000', '#fff'],
      },
    };
  },
};
</script>
