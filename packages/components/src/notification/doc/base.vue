<template>
  <div class="center-h">
    <mtd-button @click="openNotify" type="primary">预览效果</mtd-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: false,
    }
  },
  methods: {
    openNotify () {
      this.show = !this.show
      this.$mtd.notify({
        title: '通知标题',
        message: `主要信息展示说明。`,
      })
    },
  },
}
</script>

<style scoped>

</style>
