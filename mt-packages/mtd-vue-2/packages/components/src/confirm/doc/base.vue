<template>
  <div class="demo-modal-btn-groups">
    <mtd-button type="primary" @click="openConfirm">确认信息</mtd-button>
    <mtd-button type="panel" @click="openInfoConfirm">信息提示</mtd-button>
    <mtd-button type="success" @click="openSuccessConfirm">成功提示</mtd-button>
    <mtd-button type="warning" @click="openWarningConfirm">警告提示</mtd-button>
    <mtd-button type="danger" @click="openDangerConfirm">失败提示</mtd-button>
  </div>
</template>

<script>
export default {
  methods: {
    openConfirm () {
      this.$mtd.confirm({
        title: '确认信息',
        message: '春江潮水连海平，海上明月共潮生。滟滟随波千万里，何处春江无月明。江流宛转绕芳甸，月照花林皆似霰。空里流霜不觉飞，汀上白沙看不见。',
        width: '430px',
        showCancelButton: true,
      }).catch(() => {})
      const ins = this.$mtd.confirm.getInstance()
      console.log(ins)
    },
    openInfoConfirm () {
      this.$mtd.confirm({
        title: '信息提示',
        message: '这是一段描述性文字。',
        width: '430px',
        type: 'info',
        okButtonText: '我知道了',
      }).catch(() => {})
    },
    openSuccessConfirm () {
      this.$mtd.confirm({
        title: '成功提示',
        message: '信息已发送成功',
        width: '430px',
        type: 'success',
        okButtonText: '我知道了',
      }).catch(() => {})
    },
    openWarningConfirm () {
      this.$mtd.confirm({
        title: '警告提示',
        message: '删除后将清除相关内容',
        width: '430px',
        type: 'warning',
        okButtonText: '我知道了',
      }).catch(() => {})
    },
    openDangerConfirm () {
      this.$mtd.confirm({
        title: '失败提示',
        message: '信息发送失败',
        width: '430px',
        showCancelButton: true,
        type: 'error',
        okButtonText: '删除',
        okButtonProps: {
          type: 'danger',
        },
      }).catch(() => {})
    },
  },
}
</script>

<style lang="scss">
  .demo-modal-btn-groups {
    .mtd-btn {
      margin: 0 20px;
    }
  }
</style>
