<template>
  <div class="demo-modal-btn-groups">
    <mtd-button type="primary" @click="openConfirm">确认信息</mtd-button>
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
        onOk: () => {
          return new Promise((resolve, reject) => {
            setTimeout(resolve, 1000);
          });
        },
      }).catch(() => {});
    },
  },
};
</script>
