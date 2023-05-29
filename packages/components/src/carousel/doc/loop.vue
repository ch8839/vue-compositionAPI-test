<template>
  <mtd-carousel arrow="always" :loop="false">
    <mtd-carousel-item><div :style="itemStyle">0</div></mtd-carousel-item>
    <mtd-carousel-item><div :style="itemStyle">1</div></mtd-carousel-item>
    <mtd-carousel-item><div :style="itemStyle">2</div></mtd-carousel-item>
    <mtd-carousel-item><div :style="itemStyle">3</div></mtd-carousel-item>
  </mtd-carousel>
</template>
<script>
export default {
  data() {
    return {
      itemStyle: {
        height: '240px',
        lineHeight: '240px',
        textAlign: 'center',
        color: 'white',
        backgroundColor: '#5D6EAC',
        fontSize: '30px',
        fontWeight: '900',
      },
    };
  },
};
</script>
