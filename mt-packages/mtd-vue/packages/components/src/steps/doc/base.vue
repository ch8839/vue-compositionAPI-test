<template>
  <div class="demo-full-width">
    <mtd-steps v-model="active">
      <mtd-step :title="title(0)" />
      <mtd-step :title="title(1)" />
      <mtd-step :title="title(2)" />
    </mtd-steps>
    <div style="margin-top: 30px;">
      <mtd-button @click="prev">上一步</mtd-button>
      <mtd-button type="primary" style="margin-left: 24px;" @click="next">下一步</mtd-button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      active: 1,
    };
  },
  methods: {
    next () {
      if (this.active++ > 2) this.active = 0;
    },
    prev () {
      if (this.active-- < 1) this.active = 3;
    },
  },
  computed: {
    title () {
      return function(num) {
        if (this.active === num) {
          return '进行中'
        } else if (this.active > num) {
          return '已完成'
        } else {
          return '未开始'
        }
      }
    }
  }
};
</script>
