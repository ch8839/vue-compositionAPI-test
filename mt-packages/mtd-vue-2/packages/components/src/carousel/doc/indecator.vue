<template>
  <div style="width:100%">
    <div class="demo-props-option">
      <span>指示器位置：</span>
      <mtd-radio-group v-model="position">
        <mtd-radio-button value="outside">外部</mtd-radio-button>
        <mtd-radio-button value="inside">内部（底部）</mtd-radio-button>
        <mtd-radio-button value="inside-top">顶部</mtd-radio-button>
        <mtd-radio-button value="inside-left">左边</mtd-radio-button>
        <mtd-radio-button value="inside-right">右边</mtd-radio-button>
      </mtd-radio-group>
      <br>
      <span>指示器类型：</span>
      <mtd-radio-group v-model="type">
        <mtd-radio value="line">段点样式</mtd-radio>
        <mtd-radio value="circle">圆点样式</mtd-radio>
      </mtd-radio-group>
    </div>
    <br><br><br>

    <mtd-carousel 
      arrow="always" 
      @change="change" 
      :indicator-position="position"
      :indicator-type="type"
      :show-button="showButton"
    >
      <mtd-carousel-item><div :style="itemStyle(0)">0</div></mtd-carousel-item>
      <mtd-carousel-item><div :style="itemStyle(1)">1</div></mtd-carousel-item>
      <mtd-carousel-item><div :style="itemStyle(2)">2</div></mtd-carousel-item>
      <mtd-carousel-item><div :style="itemStyle(3)">3</div></mtd-carousel-item>
      <div :style="itemStyle">4(无法被识别)</div>
    </mtd-carousel>
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
      position: 'outside',
      type: 'line',
    };
  },
  computed: {
    showButton() {
      return this.position !== 'inside-left' && this.position !== 'inside-right'
    }
  },
  methods: {
    change(prev, next) {
      console.info(prev, next);
    },
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
  },
};
</script>
