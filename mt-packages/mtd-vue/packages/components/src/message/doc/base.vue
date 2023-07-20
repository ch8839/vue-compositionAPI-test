<template>
  <div class="center-h">
    <mtd-button @click="openInfoMsg" type="primary">预览效果</mtd-button>
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
  },
};
</script>
