<template>
  <div>
    <mtd-button type="primary" @click="visible = true">打开抽屉</mtd-button>
    <mtd-drawer v-model="visible" title="基础样式">
      <div>
        春江潮水连海平，海上明月共潮生。
        滟滟随波千万里，何处春江无月明！
        江流宛转绕芳甸，月照花林皆似霰。
        空里流霜不觉飞，汀上白沙看不见。
        江天一色无纤尘，皎皎空中孤月轮。
        江畔何人初见月？江月何年初照人？
        人生代代无穷已，江月年年只相似。
        不知江月待何人，但见长江送流水。
        白云一片去悠悠，青枫浦上不胜愁。
        谁家今夜扁舟子？何处相思明月楼？
      </div>
      <template #footer>
        <div class="demo-drawer-footer-btn-wrapper">
          <mtd-button>取消</mtd-button>
          <mtd-button type="primary">确认</mtd-button>
        </div>
      </template>
    </mtd-drawer>
  </div>
</template>
<script>
export default {
  data () {
    return {
      visible: false,
    };
  },
};
</script>

<style lang="scss">
.demo-drawer-footer-btn-wrapper {
  float: right;
  .mtd-btn {
    margin-left: 8px;
  }
}
</style>
