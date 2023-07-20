<template>
  <div class="demo-modal-btn-groups">
    <mtd-button type="primary" @click="openConfirm">动态confirm</mtd-button>
  </div>
</template>

<script>

export default {
  date () {
    return {
      timer: null,
    }
  },
  methods: {
    openConfirm () {
      this.$mtd.confirm({
        title: '确认信息',
        message: '春江潮水连海平，海上明月共潮生。滟滟随波千万里，何处春江无月明。江流宛转绕芳甸，月照花林皆似霰。空里流霜不觉飞，汀上白沙看不见。',
        width: '430px',
        showCancelButton: true,
        onOk: this.handleOk,
        onCancel: this.handleCancel,
      }).catch(() => {})
      const ins = this.$mtd.confirm.getInstance()
      console.log(ins)
      let second = 5
      ins._okButtonText = `${second}s后自动确认`
      this.timer = setInterval(() => {
        second--
        if (second <= 0) {
          ins.handleOk()
        }
        ins._okButtonText = `${second}s后自动确认`
      }, 1000)
    },
    handleOk () {
      clearInterval(this.timer)
      console.log('confirm OK')
    },
    handleCancel () {
      clearInterval(this.timer)
      console.log('confirm Cancel')
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
