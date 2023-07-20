<template>
  <div class="demo-box">
    <mtd-progress type="circle" :percentage="value" class="progress-base" />
    <mtd-progress :percentage="value" class="progress-base" />
    <mtd-button @click="handleClick">预览效果</mtd-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: 10,
    };
  },
  methods: {
    handleClick () {
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
  },
};
</script>
<style lang="scss">
  .demo-box{
    width: 350px;
    margin-left: 20px;
    display: inline-block;
    margin-bottom: 40px;
  }
  .demo-progress-small {
    width: 250px;
  }
</style>
