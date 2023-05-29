<template>
  <div class="demo-full-width">
    <mtd-steps :active="active">
      <mtd-step title="步骤 1" />
      <mtd-step title="步骤 2" :percentage="percentage" :description="desc"/>
      <mtd-step title="步骤 3" />
    </mtd-steps>
    <div style="margin-top: 30px;">
      <mtd-button @click="prev">上一步</mtd-button>
      <mtd-button type="primary" style="margin-left: 24px;" @click="next" :disabled="disabled">下一步</mtd-button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      active: 0,
      percentage: undefined,
      desc: '',
      disabled: false,
    };
  },
  methods: {
    next () {
      if (this.active++ > 2) this.active = 0;
      if (this.active === 1) {
        this.countDown()
      }
    },
    prev () {
      if (this.active-- < 1) this.active = 3;
    },

    countDown(seconds = 10) {
      // 倒计时 10 s
      this.disabled = true
      this.percentage = 0
      this.desc = `剩余时间 ${seconds} s`
      
      let timer = setInterval(() => {
        seconds--
        this.percentage = seconds * 10
        this.desc = `剩余时间 ${seconds} s`

        if (seconds <= 0) {
          clearInterval(timer)
          this.disabled = false
          this.desc = '倒计时已结束'
          this.percentage = 100
        }
      }, 1000)
    }

  },
};
</script>
