<template>
  <div class="demo-box">
    不渐变
    <mtd-slider v-model="value1" :thresholds="thresholds"/>
    <br/>
    渐变
    <mtd-slider v-model="value2" :thresholds="thresholds" gradients/>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value1: 50,
      value2: 50,
      thresholds: {
        values: [25, 50, 75,100],
        colors: ['#62C0FF', '#FFCA54', '#FF9F5E','red'],
      },
    };
  },
};
</script>
