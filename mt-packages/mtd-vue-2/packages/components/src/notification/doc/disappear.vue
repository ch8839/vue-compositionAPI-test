<template>
  <div class="center-h">
    <mtd-button @click="openNotify">自动消失</mtd-button>
    <mtd-button @click="openNotCloseNotify">手动关闭</mtd-button>
  </div>
</template>
<script>
export default {
  methods: {
    openNotify () {
      this.$mtd.notify({
        title: '这是一条通知标题',
        message: `主要信息展示说明。`,
      });
    },

    openNotCloseNotify () {
      this.$mtd.notify({
        title: '提示标题',
        message: '这是一条提示文案。',
        duration: 0,
      });
    },
  },
};
</script>
