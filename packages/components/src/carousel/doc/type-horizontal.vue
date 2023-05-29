<template>
  <div style="width:100%">
    <mtd-carousel arrow="never" :autoplay="false" type="horizontal" indicator-position="inside-left">
      <mtd-carousel-item><div :style="itemStyle(0)">0</div></mtd-carousel-item>
      <mtd-carousel-item><div :style="itemStyle(1)">1</div></mtd-carousel-item>
      <mtd-carousel-item><div :style="itemStyle(2)">2</div></mtd-carousel-item>
      <mtd-carousel-item><div :style="itemStyle(3)">3</div></mtd-carousel-item>
    </mtd-carousel>
    <br><br><br>
  </div>
</template>
<script>
export default {
  data() {
    return {
      bgc:{
        0: '#8FBDD3',
        1: '#E4D1B9',
        2: '#BE8C63',
        3: '#8879B0',
      },
    };
  },
  methods: {
    itemStyle(num) {
      return {
        height: '240px',
        lineHeight: '240px',
        textAlign: 'center',
        color: 'white',
        backgroundColor: this.bgc[num],
        fontSize: '30px',
        fontWeight: '900',
        //opacity: 0.5,
      }
    }
  }
};
</script>
