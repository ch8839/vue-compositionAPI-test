<template>
    <div class="demo-full-width">
      <div class="demo-step-progress-box">
        <mtd-progress :percentage="value1" :show-rate="false"/>
        <mtd-progress :percentage="value2" :show-rate="false"/>
        <mtd-progress :percentage="value3" :show-rate="false"/>
        <mtd-progress :percentage="value4" :show-rate="false"/>
        {{`${parseInt(value)}%`}}
      </div>
      <br/><br/>
      <mtd-button @click="handleClick1">预览效果</mtd-button>
    </div>
</template>

<script>
export default {
  data () {
    return {
      value: 0,
      value1: 0,
      value2: 0,
      value3: 0,
      value4: 0,
    };
  },
  watch: {
    value(v){
      this.value1 = this.createInterval(v,0)
      this.value2 = this.createInterval(v,100)
      this.value3 = this.createInterval(v,200)
      this.value4 = this.createInterval(v,300)
    }
  },
  methods: {
    handleClick1 () {
      this.value = 0;
      const f1 = () => {
        setTimeout(() => {
          if (this.value < 100) {
            this.value = this.value + 1;
            f1();
          }
        }, 100);
      };
      f1();
    },
    createInterval (v,num) {
      const val = v * 4 - num 
      return val >= 0 ? (val > 100  ? 100 : val) : 0 
    }
  },
};
</script>
<style lang="scss">
  .demo-box{
    width: 600px;
    margin-left: 20px;
    display: inline-block;
    margin-bottom: 40px;
  }

  .demo-step-progress-box{
    display: flex;
    justify-content: center;
    .mtd-progress{
      width: 20%;
      margin-right: 8px;
    }
  }
</style>