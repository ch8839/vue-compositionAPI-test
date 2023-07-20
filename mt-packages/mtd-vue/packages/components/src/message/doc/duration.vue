<template>
  <div class="center-h">
    <mtd-button @click="openInfoMsg">自动消失</mtd-button>
    <mtd-button @click="openNotCloseMsg">手动关闭</mtd-button>
  </div>
</template>
<script>
export default {
  methods: {
    openInfoMsg () {
      this.$mtd.message({
        message: '这是一条正常的消息',
        type: 'info',
      });
    },

    openNotCloseMsg () {
      this.$mtd.message({
        message: '这是一条正常的消息',
        type: 'info',
        duration: 0,
        showClose: true,
      });
    },
  },
};
</script>
