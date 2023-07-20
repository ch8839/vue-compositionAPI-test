<template>
  <div>
    <div class="center-h">
      <span> 白色主题 ：</span>
      <mtd-button @click="openSuccNotify" type="success" ghost>成功</mtd-button>
      <mtd-button @click="openWarnNotify" type="warning" ghost>警告</mtd-button>
      <mtd-button @click="openInfoNotify" ghost>消息</mtd-button>
      <mtd-button @click="openErrNotify" type="danger" ghost>错误</mtd-button>
    </div>
    <br>
    <div class="center-h">
      <span> 彩色主题 ：</span>
      <mtd-button @click="openSuccColorfulNotify" type="success">成功</mtd-button>
      <mtd-button @click="openWarnColorfulNotify" type="warning">警告</mtd-button>
      <mtd-button @click="openInfoColorfulNotify" type="panel">消息</mtd-button>
      <mtd-button @click="openErrColorfulNotify" type="danger">错误</mtd-button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    openSuccNotify () {
      this.$mtd.notify({
        title: '成功',
        message: `这是一条成功的提示消息。`,
        type: 'success',
      })
    },

    openWarnNotify () {
      this.$mtd.notify({
        title: '警告',
        message: '这是一条警告的提示消息。',
        type: 'warning',
      })
    },

    openInfoNotify () {
      this.$mtd.notify.info({
        title: '消息',
        message: `这是一条常规的提示消息。`,
      })
    },

    openErrNotify () {
      this.$mtd.notify.error({
        title: '错误',
        message: '这是一条错误的提示消息。',
      })
    },

    openSuccColorfulNotify () {
      this.$mtd.notify({
        title: '成功',
        message: `这是一条成功的提示消息。`,
        type: 'success',
        colorful: true,
      })
    },

    openWarnColorfulNotify () {
      this.$mtd.notify({
        title: '警告',
        message: '这是一条警告的提示消息。',
        type: 'warning',
        colorful: true,
      })
    },

    openInfoColorfulNotify () {
      this.$mtd.notify.info({
        title: '消息',
        message: `这是一条常规的提示消息。`,
        colorful: true,
      })
    },

    openErrColorfulNotify () {
      this.$mtd.notify.error({
        title: '错误',
        message: '这是一条错误的提示消息。',
        colorful: true,
      })
    },
  },
}
</script>
